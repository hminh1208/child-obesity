package monash.pinwheel.entity;

import java.sql.Date;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

import javax.faces.bean.ManagedBean;

@ManagedBean
public class BMI {
	private int id;
	private int kidId;
	private float weight;
	private float height;
	private String inputDate;

	public BMI() {
		// TODO Auto-generated constructor stub
	}

	public BMI(int id, int kidId, float weight, float height, Date inputDate) {
		this.id = id;
		this.kidId = kidId;
		this.weight = weight;
		this.height = height;
		DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
		this.inputDate = df.format(inputDate);
	}
	
	public BMI(int kidId, float weight, float height, Date inputDate) {
		this.kidId = kidId;
		this.weight = weight;
		this.height = height;
		DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
		this.inputDate = df.format(inputDate);
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getKidId() {
		return kidId;
	}

	public void setKidId(int kidId) {
		this.kidId = kidId;
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

	public String getInputDate() {
		return inputDate;
	}

	public void setInputDate(String inputDate) {
		this.inputDate = inputDate;
	}

}
