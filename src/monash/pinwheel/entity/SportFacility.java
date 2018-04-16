package monash.pinwheel.entity;

import java.text.DecimalFormat;
import java.text.NumberFormat;

public class SportFacility {
	
	private String id;
	private float latitude;
	private float longitude;
	private String name;
	private int street_no;
	private String street_name;
	private String street_type;
	private String suburb;
	private int postCode;
	private String sportListAndType;
	private String lga;
	private String address;
	private float distance;
	
	
	public SportFacility() {
		// TODO Auto-generated constructor stub
	}
	
	public void concatSportType(String sport, String type) {
		if (sportListAndType == null) {
			sportListAndType =sport + "(" + type + ")";
		}else {
			sportListAndType += ", " + sport + "(" + type + ")";
		}
	}
	
	public String getId() {
		return id;
	}


	public void setId(String id) {
		this.id = id;
	}


	public float getLatitude() {
		return latitude;
	}


	public void setLatitude(float latitude) {
		this.latitude = latitude;
	}


	public float getLongitude() {
		return longitude;
	}


	public void setLongitude(float longitude) {
		this.longitude = longitude;
	}


	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	public int getStreet_no() {
		return street_no;
	}


	public void setStreet_no(int street_no) {
		this.street_no = street_no;
	}


	public String getStreet_name() {
		return street_name;
	}

	public float getDistance() {
		return distance;
	}

	public void setDistance(float distance) {
		this.distance = distance;
	}
	
	public void setDistanceFromPoint(float lat, float lon) {
		 double theta = this.longitude - lon;
	        double dist = Math.sin(deg2rad(this.latitude)) * Math.sin(deg2rad(lat)) + Math.cos(deg2rad(this.latitude)) * Math.cos(deg2rad(lat)) * Math.cos(deg2rad(theta));
	        dist = Math.acos(dist);
	        dist = rad2deg(dist);
	        dist = dist * 60 * 1.1515;
	        dist = dist * 1.609344;

	        NumberFormat formatter = new DecimalFormat("#0.00");
	        this.distance = Float.valueOf(formatter.format(dist));
	}
	
	private static double rad2deg(double rad) {
        return (rad * 180 / Math.PI);
    }

    private static double deg2rad(double deg) {
        return (deg * Math.PI / 180.0);
    }

	public void setStreet_name(String street_name) {
		this.street_name = street_name;
	}


	public String getStreet_type() {
		return street_type;
	}


	public void setStreet_type(String street_type) {
		this.street_type = street_type;
	}


	public String getSuburb() {
		return suburb;
	}


	public void setSuburb(String suburb) {
		this.suburb = suburb;
	}


	public int getPostCode() {
		return postCode;
	}


	public void setPostCode(int postCode) {
		this.postCode = postCode;
	}


	public String getSportListAndType() {
		return sportListAndType;
	}


	public void setSportListAndType(String sportListAndType) {
		this.sportListAndType = sportListAndType;
	}


	public String getLga() {
		return lga;
	}


	public void setLga(String lga) {
		this.lga = lga;
	}


	public String getAddress() {
		return address;
	}


	public void setAddress(String address) {
		this.address = address;
	}
}
