use serde::{Deserialize, Serialize};
use serde_json::Result;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Job {
	version: String,

	id: u32,

	input: Option<u32>,

	#[serde(skip_serializing_if = "Option::is_none")]
	output: Option<String>,

	#[serde(skip_serializing_if = "Option::is_none")]
	calc_started_at: Option<String>,

	#[serde(skip_serializing_if = "Option::is_none")]
	finished_at: Option<String>,

	#[serde(skip_serializing_if = "Option::is_none")]
	status: Option<String>
}

#[allow(dead_code)]
fn parse_job(json: &str) -> Result<Job> {
	let job: Result<Job> = serde_json::from_str(json);
	return job;
}

#[allow(dead_code)]
fn to_string(job: &Job) -> Result<String> {
	let json: Result<String> = serde_json::to_string(job);
	return json;
}

#[cfg(test)]
mod tests {
	use super::*;

	#[test]
	fn test_from_str_required_fields() {
		let json = r#"
			{
				"version": "v1",
				"id": 42,
				"input": 123456
			}
		"#;
		let job = parse_job(json);
		assert!(job.is_ok());

		let job = job.unwrap();
		assert_eq!(job.version, "v1");
		assert_eq!(job.id, 42);
		assert_eq!(job.input.unwrap(), 123456);
	}

	#[test]
	fn test_from_str_all_fields() {
		let json = r#"
			{
				"version": "v1",
				"id": 42,
				"input": 123456,
				"output": "93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000",
				"calcStartedAt": "2021-12-28T09:11:22.469Z",
				"finishedAt": "2021-12-28T09:11:22.123Z",
				"status": "finished"
			}
		"#;
		println!("{:?}", json);
		let job = parse_job(json);
		assert!(job.is_ok());

		let job = job.unwrap();
		assert_eq!(job.version, "v1");
		assert_eq!(job.id, 42);
		assert_eq!(job.input, Some(123456));
		assert_eq!(job.output, Some(String::from("93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000")));
		assert_eq!(job.calc_started_at, Some(String::from("2021-12-28T09:11:22.469Z")));
		assert_eq!(job.finished_at, Some(String::from("2021-12-28T09:11:22.123Z")));
		assert_eq!(job.status, Some(String::from("finished")))
	}

	#[test]
	fn test_to_str_required_fields() {
		let job = Job {
			version: String::from("v2"),
			id: 13,
			input: Some(654321),
			output: None,
			calc_started_at: None,
			finished_at: None,
			status: None
		};

		let expected = r#"
			{
				"version": "v2",
				"id": 13,
				"input": 654321
			}
		"#;

		let expected = expected.replace("\t", "").replace("\n", "").replace(" ", "");
		println!("expected: {}", expected);
		
		let actual = to_string(&job);
		assert!(actual.is_ok());

		let actual = actual.unwrap();
		assert_eq!(expected, actual);
	}

	#[test]
	fn test_to_str_all_fields() {
		let job = Job {
			version: String::from("v2"),
			id: 13,
			input: Some(654321),
			output: Some(String::from("71569457046263802294811533723186532165584657342365752577109445058227039255480148842668944867280814080000000000000000000")),
			calc_started_at: Some(String::from("2021-12-28T09:11:22.123Z")),
			finished_at: Some(String::from("2021-12-28T09:11:22.469Z")),
			status: Some(String::from("pending"))
		};

		let expected = r#"
			{
				"version": "v2",
				"id": 13,
				"input": 654321,
				"output": "71569457046263802294811533723186532165584657342365752577109445058227039255480148842668944867280814080000000000000000000",
				"calcStartedAt": "2021-12-28T09:11:22.123Z",
				"finishedAt": "2021-12-28T09:11:22.469Z",
				"status": "pending"
			}
		"#;

		let expected = expected.replace("\t", "").replace("\n", "").replace(" ", "");
		println!("expected: {}", expected);
		
		let actual = to_string(&job);
		assert!(actual.is_ok());

		let actual = actual.unwrap();
		assert_eq!(expected, actual);
	}

}