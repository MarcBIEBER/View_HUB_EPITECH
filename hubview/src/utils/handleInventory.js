import axios from "axios";
import { getCookie } from "./handlePage";

export const modifyItemInventory = async (name, row, value) => {

    const body = {
        name: name,
        row: row,
        value: value,
        token: getCookie("accessToken")
    }
    const res = await axios.post('http://localhost:3000/inventory/api/v1/modifyItem', body);
    return res.data;
}

export const removeItemInventory = async (name) => {
    const res = await axios.delete('http://localhost:3000/inventory/api/v1/deleteItem?name=' + name + '&token=' + getCookie("accessToken"));
    return res;
}