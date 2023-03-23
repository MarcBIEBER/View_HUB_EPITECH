import axios from "axios";

export const modifyItemInventory = async (name, row, value) => {

    const body = {
        name: name,
        row: row,
        value: value
    }
    const res = await axios.post('http://localhost:3000/inventory/api/v1/modifyItem', body);
    return res.data;
}

export const removeItemInventory = async (name) => {
    const body = {
        name: name
    }
    const res = await axios.delete('http://localhost:3000/inventory/api/v1/deleteItem?name=' + name);
    return res;
}