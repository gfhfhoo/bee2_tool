#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use itertools::Itertools;
use jieba_rs::Jieba;
use tauri::generate_handler;
use tauri::State;

use app::{CookieState, init};

#[tauri::command]
fn request_jieba(msg: String, jieba: State<Jieba>) -> Vec<String> {
    let words: Vec<String> = jieba.cut_for_search(&*msg, true)
        .iter()
        .map(|s| s.to_string())
        .collect();
    let words = words.into_iter().unique().collect();
    return words;
}

#[tauri::command]
async fn set_douyin_cookie(cookie: String, state: State<'_, CookieState>) -> Result<(), ()> {
    *state.0.lock().await = cookie;
    Ok(())
}

// Main
fn main() {
    tauri::Builder::default()
        .manage(Jieba::new())
        .plugin(init())
        .invoke_handler(generate_handler![request_jieba,set_douyin_cookie])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
