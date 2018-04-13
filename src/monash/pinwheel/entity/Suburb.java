package monash.pinwheel.entity;

public class Suburb {
	private String suburbName;
	private int postCode;
	
	public Suburb() {
		// TODO Auto-generated constructor stub
	}
	
	public Suburb(String suburbName, int postCode) {
		// TODO Auto-generated constructor stub
		this.suburbName = suburbName;
		this.postCode = postCode;
	}

	public String getSuburbName() {
		return suburbName;
	}

	public void setSuburbName(String suburbName) {
		this.suburbName = suburbName;
	}

	public int getPostCode() {
		return postCode;
	}

	public void setPostCode(int postCode) {
		this.postCode = postCode;
	}
	
	
}
