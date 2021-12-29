use aws_sdk_sqs::{Client};
use aws_sdk_sqs::model::Message;
use aws_smithy_http::endpoint::Endpoint;
use http::Uri;
use std::error::Error;

use crate::config;

fn get_endpoint() -> Endpoint {
	let endpoint: Uri = config::get_sqs_endpoint().parse().expect("Unable to parse endoint");
	return Endpoint::immutable(endpoint)
}

fn get_queue_endpoint() -> String {
	return config::get_queue_endpoint();
}

pub async fn sqs_client() -> aws_sdk_sqs::Client {
	let config = aws_config::from_env().load().await;
	let mut sqs_config_builder = aws_sdk_sqs::config::Builder::from(&config);
	sqs_config_builder = sqs_config_builder.endpoint_resolver(get_endpoint());
	aws_sdk_sqs::Client::from_conf(sqs_config_builder.build())
}

pub async fn receive_message(client: &Client) -> Option<Message> {
	let rsp = client
		.receive_message()
		.queue_url(get_queue_endpoint())
		.set_max_number_of_messages(Some(1))
		.send()
		.await;

	match rsp {
		Ok(rsp) => {
			match rsp.messages {
				Some(mut messages) => {
					if messages.len() == 1 {
						let message = messages.pop();
						return message;
					}
					return None
				},
				None => None
			}
		},
		Err(_) => None,
	}
}

pub async fn delete_message(client: &Client, receipt_handle: &str) -> Result<(), Box<dyn Error>> {
	client
		.delete_message()
		.receipt_handle(receipt_handle)
		.queue_url(get_queue_endpoint())
		.send()
		.await?;

	return Ok(());
}

#[cfg(test)]
mod tests {
	use super::*;

	#[actix_rt::test]
	async fn test_receive_message() {
		let client = sqs_client().await;

		let message = receive_message(&client).await;
		println!("message {:?}", message);

		if message.is_some() {
			let receipt_handle = message.unwrap().receipt_handle.unwrap();
			let _ = delete_message(&client, &receipt_handle).await;
			println!("message deleted");
		}
		assert!(false);
	}

}

//  async fn send_receive(client: &Client) -> Result<(), Box<dyn Error>> {
// 	let queues = client.list_queues().send().await?;
// 	let mut queue_urls = queues.queue_urls.unwrap_or_default();
// 	let queue_url = match queue_urls.pop() {
// 		Some(url) => url,
// 		None => {
// 			eprintln!("No queues in this account. Please create a queue to proceed");
// 		}
// 	};
// 	println!(
// 		"Sending and receiving messages on with URL: `{}`",
// 		queue_url
// 	);
// 	let rsp = client
// 		.send_message()
// 		.queue_url(&queue_url)
// 		.message_body("hello from my queue")
// 		.message_group_id("MyGroup")
// 		.send()
// 		.await?;
// 	println!("Response from sending a message: {:#?}", rsp);
// 	let rcv_message_output = client
// 		.receive_message()
// 		.queue_url(&queue_url)
// 		.send()
// 		.await?;
// 	for message in rcv_message_output.messages.unwrap_or_default() {
// 		println!("Got the message: {:#?}", message);
// 	}
// 	Ok(())
// }