package monash.pinwheel.entity;

import java.sql.Date;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

import javax.faces.bean.ManagedBean;

@ManagedBean
public class Kid {
	private int id;
	private String dob;
	private String name;
	private float weight;
	private float height;
	private int gender;
	private String nameLabel;
	
	public Kid() {
		// TODO Auto-generated constructor stub
	}
	
	public Kid(int id, String name, float w, float h) {
		this.id = id;
		this.name = name;
		this.weight = w;
		this.height = h;
	}

	public Kid(int id, String name, int gender, Date dob) {
		this.id = id;
		this.name = name;
		this.gender = gender;
		DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
		this.dob = df.format(dob);
	}
	
	
	public String getNameLabel() {
		return name.substring(0, 1);
	}

	public int getGender() {
		return gender;
	}

	public void setGender(int gender) {
		this.gender = gender;
	}

	public String getDob() {
		return dob;
	}

	public void setDob(String dob) {
		this.dob = dob;
	}

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public float getWeight() {
		return weight;
	}
	public void setWeight(float weight) {
		this.weight = weight;
	}
	public float getHeight() {
		return height;
	}
	public void setHeight(float height) {
		this.height = height;
	}
	
}
