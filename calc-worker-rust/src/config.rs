use std::env;

fn get_env(key: &str, fallback: &str) -> String {
	let value = env::var(&key);
	match value {
		Ok(value) => value,
		_ => String::from(fallback)
	}
}

fn get_env_number(key: &str, fallback: i32) -> i32 {
	let value = env::var(&key);
	match value {
		Ok(value) => {
			let value = value.parse::<i32>();
			match value {
				Ok(value) => value,
				_ => fallback
			}
		},
		_ => fallback
	}
}

pub fn get_sqs_endpoint() -> String {
	return get_env("SQS_ENDPOINT", "http://localhost:9324");
}

pub fn get_queue_endpoint() -> String {
	return get_env("QUEUE_ENDPOINT", "http://localhost:9324/queue/default");
}

pub fn get_api_endpoint() -> String {
	return get_env("API_ENDPOINT", "http://localhost:8081");
}

pub fn get_polling_interval() -> i32 {
	return get_env_number("POLLING_INTERVAL", 1000);
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