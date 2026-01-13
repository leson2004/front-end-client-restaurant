import axios from "axios";

const API_BASE_URL = "https://provinces.open-api.vn/api";

export const fetchProvinces = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/p/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};

export const fetchDistricts = async (provinceCode) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/p/${provinceCode}?depth=2`
    );
    return response.data.districts;
  } catch (error) {
    console.error("Error fetching districts:", error);
    throw error;
  }
};

export const fetchWards = async (districtCode) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/d/${districtCode}?depth=2`
    );
    return response.data.wards;
  } catch (error) {
    console.error("Error fetching wards:", error);
    throw error;
  }
};

export const getFullAddress = (streetAddress, ward, district, province) => {
  return `${streetAddress}, ${ward}, ${district}, ${province}`
    .replace(/^,\s*/, "")
    .replace(/,\s*,/g, ",")
    .trim();
};
