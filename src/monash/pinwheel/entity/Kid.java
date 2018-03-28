package monash.pinwheel.entity;

import java.sql.Date;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

import javax.faces.bean.ManagedBean;

// TODO: Auto-generated Javadoc
/**
 * The Class Kid.
 */
@ManagedBean
public class Kid {
	
	/** The id. */
	private int id;
	
	/** The dob. */
	private String dob;
	
	/** The name. */
	private String name;
	
	/** The weight. */
	private float weight;
	
	/** The height. */
	private float height;
	
	/** The gender. */
	private int gender;
	
	/** The name label. */
	private String nameLabel;
	
	/**
	 * Instantiates a new kid.
	 */
	public Kid() {
		// TODO Auto-generated constructor stub
	}
	
	/**
	 * Instantiates a new kid.
	 *
	 * @param id the id
	 * @param name the name
	 * @param w the w
	 * @param h the h
	 */
	public Kid(int id, String name, float w, float h) {
		this.id = id;
		this.name = name;
		this.weight = w;
		this.height = h;
	}

	/**
	 * Instantiates a new kid.
	 *
	 * @param id the id
	 * @param name the name
	 * @param gender the gender
	 * @param dob the dob
	 */
	public Kid(int id, String name, int gender, Date dob) {
		this.id = id;
		this.name = name;
		this.gender = gender;
		DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
		this.dob = df.format(dob);
	}
	
	
	/**
	 * Gets the name label.
	 *
	 * @return the name label
	 */
	public String getNameLabel() {
		return name.substring(0, 1);
	}

	/**
	 * Gets the gender.
	 *
	 * @return the gender
	 */
	public int getGender() {
		return gender;
	}

	/**
	 * Sets the gender.
	 *
	 * @param gender the new gender
	 */
	public void setGender(int gender) {
		this.gender = gender;
	}

	/**
	 * Gets the dob.
	 *
	 * @return the dob
	 */
	public String getDob() {
		return dob;
	}

	/**
	 * Sets the dob.
	 *
	 * @param dob the new dob
	 */
	public void setDob(String dob) {
		this.dob = dob;
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
	 * Gets the name.
	 *
	 * @return the name
	 */
	public String getName() {
		return name;
	}
	
	/**
	 * Sets the name.
	 *
	 * @param name the new name
	 */
	public void setName(String name) {
		this.name = name;
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
	
}
