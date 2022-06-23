#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{Manager, SystemTray, SystemTrayEvent};

fn main() {
    let tray = SystemTray::new();
    tauri::Builder::default()
        .system_tray(tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick { .. } | SystemTrayEvent::RightClick { .. } => {
                if let Some(window) = app.get_window("main") {
                    if let Ok(true) = window.is_visible() {
                        let _ = window.hide();
                    } else {
                        let _ = window.show();
                    }
                }
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
