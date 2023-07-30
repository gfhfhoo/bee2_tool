#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[derive(Debug, thiserror::Error)]
enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
}

impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

use std::fs::File;
use std::io;
use std::io::prelude::*;
use std::path::Path;

use app::OptionState;
use itertools::Itertools;
use jieba_rs::Jieba;
use tauri::generate_handler;
use tauri::AppHandle;
use tauri::Runtime;
use tauri::State;

use app::init;
use tokio_tungstenite::tungstenite;

#[tauri::command]
fn request_jieba(msg: String, jieba: State<Jieba>) -> Vec<String> {
    let words: Vec<String> = jieba
        .cut_for_search(&*msg, true)
        .iter()
        .map(|s| s.to_string())
        .collect();
    let words = words.into_iter().unique().collect();
    return words;
}

#[tauri::command]
async fn set_douyin_cookie(cookie: String, state: State<'_, OptionState>) -> Result<(), ()> {
    (*state.0.lock().await).cookie = cookie;
    Ok(())
}

#[tauri::command]
async fn set_douyin_web_key(state: State<'_, OptionState>) -> Result<String, ()> {
    let key = tungstenite::handshake::client::generate_key();
    (*state.0.lock().await).web_key = key.clone();
    Ok(key)
}

#[tauri::command]
async fn generate_data(input: String, dst: String, handle: AppHandle) -> Result<(), Error> {
    let path = handle.path_resolver().app_data_dir().unwrap().join(dst);
    let mut w = File::options()
        .create(true)
        .write(true)
        .truncate(true)
        .open(path)?;
    w.write_all(input.as_bytes())?;
    Ok(())
}

#[tauri::command]
async fn read_data(src: String, handle: AppHandle) -> Result<String, Error> {
    let mut s = String::new();
    let path = handle.path_resolver().app_data_dir().unwrap().join(src);
    let r = File::options().create(true).read(true).open(path);
    Ok(match r {
        Ok(mut f) => {
            f.read_to_string(&mut s)?;
            return Ok(s);
        },
        Err(_) => "".to_string(),
    })
}

// Main
fn main() {
    tauri::Builder::default()
        .manage(Jieba::new())
        .plugin(init())
        .invoke_handler(generate_handler![
            request_jieba,
            set_douyin_cookie,
            set_douyin_web_key,
            generate_data,
            read_data,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
