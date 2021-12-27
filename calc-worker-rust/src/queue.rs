use aws_sdk_sqs::{Client};
use aws_smithy_http::endpoint::Endpoint;
use http::Uri;
use std::error::Error;

#[actix_rt::test]
async fn main() -> Result<(), Box<dyn Error>> {
	let shared_config = aws_config::from_env().load().await;
	let sqs_client = sqs_client(&shared_config);
	let queues = sqs_client.list_queues().send().await?;
	println!("SQS queues: {:?}", queues.queue_urls().unwrap_or_default());
	let res = receive_message(&sqs_client).await;
	println!("res {:?}", res);
	assert!(true);
	Ok(())
 }

 /// If LOCALSTACK environment variable is true, use LocalStack endpoints.
 /// You can use your own method for determining whether to use LocalStack endpoints.
 #[allow(dead_code)]
 fn use_localstack() -> bool {
	std::env::var("LOCALSTACK").unwrap_or_default() == "true"
 }

 fn localstack_endpoint() -> Endpoint {
	Endpoint::immutable(Uri::from_static("http://localhost:9324/"))
 }

 #[allow(dead_code)]
 fn sqs_client(conf: &aws_types::config::Config) -> aws_sdk_sqs::Client {
	let mut sqs_config_builder = aws_sdk_sqs::config::Builder::from(conf);
	sqs_config_builder = sqs_config_builder.endpoint_resolver(localstack_endpoint());
	aws_sdk_sqs::Client::from_conf(sqs_config_builder.build())
 }

#[allow(dead_code)]
async fn receive_message(client: &Client) -> Result<(), Box<dyn Error>> {
	println!("foo");
	let rsp = client
		.receive_message()
		.queue_url("http://calc-queue:9324/queue/default")
		.set_max_number_of_messages(Some(1))
		.send()
		.await?;

	println!("received");
	for message in rsp.messages.unwrap_or_default() {
		println!("Got the message: {:#?}", message);
	}
	Ok(())
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