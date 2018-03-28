package monash.pinwheel.entity;

import java.sql.Date;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

import javax.faces.bean.ManagedBean;

// TODO: Auto-generated Javadoc
/**
 * The Class is BMI entity.
 */
@ManagedBean
public class BMI {
	
	/** The id of BMI record. */
	private int id;
	
	/** The kid id. */
	private int kidId;
	
	/** The kid's weight. */
	private float weight;
	
	/** The kid's height. */
	private float height;
	
	/** The input date. */
	private String inputDate;

	/**
	 * Instantiates a new bmi.
	 */
	public BMI() {
		// TODO Auto-generated constructor stub
	}

	/**
	 * Instantiates a new bmi.
	 *
	 * @param id the id
	 * @param kidId the kid id
	 * @param weight the weight
	 * @param height the height
	 * @param inputDate the input date
	 */
	public BMI(int id, int kidId, float weight, float height, Date inputDate) {
		this.id = id;
		this.kidId = kidId;
		this.weight = weight;
		this.height = height;
		DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
		this.inputDate = df.format(inputDate);
	}
	
	/**
	 * Instantiates a new bmi.
	 *
	 * @param kidId the kid id
	 * @param weight the weight
	 * @param height the height
	 * @param inputDate the input date
	 */
	public BMI(int kidId, float weight, float height, Date inputDate) {
		this.kidId = kidId;
		this.weight = weight;
		this.height = height;
		DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
		this.inputDate = df.format(inputDate);
	}

	/**
	 * Gets the id.
	 *
	 * @return the id
	 */
	public int getId() {
		return id;
	}

	/**
	 * Sets the id.
	 *
	 * @param id the new id
	 */
	public void setId(int id) {
		this.id = id;
	}

	/**
	 * Gets the kid id.
	 *
	 * @return the kid id
	 */
	public int getKidId() {
		return kidId;
	}

	/**
	 * Sets the kid id.
	 *
	 * @param kidId the new kid id
	 */
	public void setKidId(int kidId) {
		this.kidId = kidId;
	}

	/**
	 * Gets the weight.
	 *
	 * @return the weight
	 */
	public float getWeight() {
		return weight;
	}

	/**
	 * Sets the weight.
	 *
	 * @param weight the new weight
	 */
	public void setWeight(float weight) {
		this.weight = weight;
	}

	/**
	 * Gets the height.
	 *
	 * @return the height
	 */
	public float getHeight() {
		return height;
	}

	/**
	 * Sets the height.
	 *
	 * @param height the new height
	 */
	public void setHeight(float height) {
		this.height = height;
	}

	/**
	 * Gets the input date.
	 *
	 * @return the input date
	 */
	public String getInputDate() {
		return inputDate;
	}

	/**
	 * Sets the input date.
	 *
	 * @param inputDate the new input date
	 */
	public void setInputDate(String inputDate) {
		this.inputDate = inputDate;
	}

}
