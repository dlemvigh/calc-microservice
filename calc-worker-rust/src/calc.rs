use num_bigint::{BigUint, ToBigUint};

#[allow(dead_code)]
pub fn factorial(n: usize) -> BigUint
{
	let mut acc: BigUint = n.to_biguint().unwrap();

	for i in 1..n {
		acc *= i;
	}

	return acc;
}

#[cfg(test)]
mod tests {
	use super::*;
	use test_case::test_case;

	#[test_case(1, b"1")]
	#[test_case(2, b"2")]
	#[test_case(3, b"6")]
	#[test_case(4, b"24")]
	#[test_case(5, b"120")]
	#[test_case(10, b"3628800")]
	#[test_case(40, b"815915283247897734345611269596115894272000000000")]
	#[test_case(60, b"8320987112741390144276341183223364380754172606361245952449277696409600000000000000")]
	#[test_case(80, b"71569457046263802294811533723186532165584657342365752577109445058227039255480148842668944867280814080000000000000000000")]
	#[test_case(100, b"93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000")]
	fn factorial_tests(n: usize, bytes: &[u8]) {
		let expected = BigUint::parse_bytes(bytes, 10).unwrap();
		let actual = factorial(n);
		assert_eq!(expected, actual);
	}
}
