use keyring::Entry;
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};

const SERVICE: &str = "raven-ai";
const ACCOUNT: &str = "auth-token";

#[derive(Serialize, Deserialize)]
struct StoredToken {
    token: String,
    // Unix timestamp in seconds.
    expires_at: u64,
}

fn entry() -> Result<Entry, String> {
    Entry::new(SERVICE, ACCOUNT).map_err(|e| e.to_string())
}

fn delete(entry: &Entry) -> Result<(), String> {
    match entry.delete_credential() {
        Ok(()) | Err(keyring::Error::NoEntry) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn token_set(token: String, expires_at: u64) -> Result<(), String> {
    let value = serde_json::to_string(&StoredToken { token, expires_at }).map_err(|e| e.to_string())?;
    entry()?.set_password(&value).map_err(|e| e.to_string())
}

// Returns `None` when there is no token or it has expired (the expired one is removed).
#[tauri::command]
pub fn token_get() -> Result<Option<String>, String> {
    let entry = entry()?;
    let value = match entry.get_password() {
        Ok(v) => v,
        Err(keyring::Error::NoEntry) => return Ok(None),
        Err(e) => return Err(e.to_string()),
    };

    let stored: StoredToken = match serde_json::from_str(&value) {
        Ok(s) => s,
        // Corrupted entry, drop it.
        Err(_) => {
            delete(&entry)?;
            return Ok(None);
        }
    };

    let now = SystemTime::now().duration_since(UNIX_EPOCH).map_err(|e| e.to_string())?.as_secs();
    if stored.expires_at <= now {
        delete(&entry)?;
        return Ok(None);
    }
    Ok(Some(stored.token))
}

#[tauri::command]
pub fn token_clear() -> Result<(), String> {
    delete(&entry()?)
}
