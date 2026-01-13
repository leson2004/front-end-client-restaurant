import React, { useState, useEffect } from "react";
import {
    fetchProvinces,
    fetchDistricts,
    fetchWards,
} from "../../Services/LocationService/LocationService";

const AddressSelector = ({ onChange, initialAddress }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [streetAddress, setStreetAddress] = useState("");

    // Fetch danh sách tỉnh/thành phố khi component mount
    useEffect(() => {
        fetchProvinces().then(data => {
            setProvinces(data);
        }).catch(console.error);
    }, []);

    // Handle initialAddress
    useEffect(() => {
        if (initialAddress && typeof initialAddress === 'string') {
            const addressParts = initialAddress.split(', ').reverse();
            if (addressParts.length >= 4) {
                const [province, district, ward, ...streetParts] = addressParts;
                setStreetAddress(streetParts.reverse().join(', '));

                // Tìm và set province
                const foundProvince = provinces.find(p => p.name === province);
                if (foundProvince) {
                    setSelectedProvince(foundProvince.code);
                    // Fetch districts sau khi tìm thấy province
                    fetchDistricts(foundProvince.code).then(districtData => {
                        setDistricts(districtData);
                        const foundDistrict = districtData.find(d => d.name === district);
                        if (foundDistrict) {
                            setSelectedDistrict(foundDistrict.code);
                            // Fetch wards sau khi tìm thấy district
                            fetchWards(foundDistrict.code).then(wardData => {
                                setWards(wardData);
                                const foundWard = wardData.find(w => w.name === ward);
                                if (foundWard) {
                                    setSelectedWard(foundWard.code);
                                }
                            }).catch(console.error);
                        }
                    }).catch(console.error);
                }
            }
        }
    }, [initialAddress, provinces]);

    // Fetch danh sách quận/huyện khi tỉnh/thành phố thay đổi
    useEffect(() => {
        if (selectedProvince) {
            fetchDistricts(selectedProvince).then(data => {
                setDistricts(data);
            }).catch(console.error);
            setSelectedDistrict("");
            setSelectedWard("");
            setWards([]);
        }
    }, [selectedProvince]);

    // Fetch danh sách phường/xã khi quận/huyện thay đổi
    useEffect(() => {
        if (selectedDistrict) {
            fetchWards(selectedDistrict).then(data => {
                setWards(data);
            }).catch(console.error);
            setSelectedWard("");
        }
    }, [selectedDistrict]);

    // Cập nhật địa chỉ đầy đủ khi có bất kỳ thay đổi nào
    useEffect(() => {
        const getNameFromCode = (array, code) => array.find(item => item.code.toString() === code?.toString())?.name || "";

        const province = getNameFromCode(provinces, selectedProvince);
        const district = getNameFromCode(districts, selectedDistrict);
        const ward = getNameFromCode(wards, selectedWard);

        const fullAddress = [streetAddress, ward, district, province]
            .filter(Boolean)
            .join(", ")
            .trim();

        // Gọi hàm onChange để cập nhật giá trị trong component cha
        onChange({
            province: selectedProvince,
            district: selectedDistrict,
            ward: selectedWard,
            streetAddress,
            fullAddress
        });
    }, [selectedProvince, selectedDistrict, selectedWard, streetAddress, onChange, provinces, districts, wards]);

    // Render các dropdown và input
    return (
        <>
            {/* Dropdown cho tỉnh/thành phố */}
            <select
                className="form-select mb-1"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
            >
                <option value="">Chọn Tỉnh/Thành phố</option>
                {provinces.map((province) => (
                    <option key={province.code} value={province.code}>
                        {province.name}
                    </option>
                ))}
            </select>

            {/* Dropdown cho quận/huyện */}
            <select
                className="form-select mb-1"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
            >
                <option value="">Chọn Quận/Huyện</option>
                {districts.map((district) => (
                    <option key={district.code} value={district.code}>
                        {district.name}
                    </option>
                ))}
            </select>

            {/* Dropdown cho phường/xã */}
            <select
                className="form-select mb-1"
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
            >
                <option value="">Chọn Phường/Xã</option>
                {wards.map((ward) => (
                    <option key={ward.code} value={ward.code}>
                        {ward.name}
                    </option>
                ))}
            </select>

            {/* Input cho số nhà, tên đường */}
            <input
                type="text"
                className="form-control"
                placeholder={"Số nhà, tên đường"}
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
            />
        </>
    );
};

export default AddressSelector;
