import { useState } from "react";
import axios from "axios";

function AddMobile() {
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [cover, setCover] = useState(null);
  const [images, setImages] = useState([]);

  const submit = async () => {
    const formData = new FormData();
    formData.append("model", model);
    formData.append("price", price);
    formData.append("coverImage", cover);

    for (let img of images) {
      formData.append("images", img);
    }

    await axios.post("http://localhost:5000/api/mobiles", formData);
    alert("Mobile Added");
  };

  return (
    <>
      <input placeholder="Model" onChange={e => setModel(e.target.value)} />
      <input type="number" placeholder="Price" onChange={e => setPrice(e.target.value)} />
      <input type="file" onChange={e => setCover(e.target.files[0])} />
      <input type="file" multiple onChange={e => setImages(e.target.files)} />
      <button onClick={submit}>Add</button>
    </>
  );
}

export default AddMobile;
