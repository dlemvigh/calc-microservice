
use crate::config;
use std::error::Error;

async fn http_client() -> Result<String, Box<dyn Error>> {
	let uri = config::get_api_endpoint() + "/factorial";
	let resp = reqwest::get(uri).await?;

	let body = resp.text().await?;

	return Ok(body);
}

#[cfg(test)]
mod tests {
	use super::*;
	use tokio;

	#[test]
	fn foo() {
		let runtime = tokio::runtime::Runtime::new().expect("Unable to create runtime");
		let _  = runtime.block_on(http_client());

		assert!(false);
	}
}