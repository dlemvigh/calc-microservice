use std::env;

#[allow(dead_code)]
fn get_env(key: &str, fallback: &str) -> String {
	let value = env::var(&key);
	match value {
		Ok(value) => value,
		_ => String::from(fallback)
	}
}

#[cfg(test)]
mod tests {
	use super::*;

	#[test]
	fn test_get_env_fallback() {
		let value = get_env("DOES_NOT_EXIST", "some-fallback-value");
		assert_eq!(value, "some-fallback-value");
	}

	#[test]
	fn test_get_env() {
		let value = get_env("HOME", "some-fallback-value");
		assert_ne!(value, "some-fallback-value");
	}
}