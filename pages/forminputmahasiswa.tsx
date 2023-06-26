import { useState,useEffect } from "react";
import axios from "axios";
import { stat } from "fs";

 const koneksiMahasiswa = axios.create({
  
  baseURL: "http://127.0.0.1:5000/api/mahasiswa" 
});

export default function FormMahasiswa() {
    const [statenama, setNama] = useState("");
    const [statenim, setNim] = useState("");
    const [statetanggal, setTanggal] = useState("2018-07-22");
    const [statealamat, setAlamat] = useState("");
    const [statefoto, setFoto] = useState("");
    const [mahasiswa, setMahasiswa] =  useState(null);
    const [stateadd,setAdd]=useState("hide");
    const [statebutonadd,setbtnAdd]=useState("show");
     
    const [stateedit,setEdit]=useState("hide");

     
    function formatDate(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();
  
      if (month.length < 2) 
          month = '0' + month;
      if (day.length < 2) 
          day = '0' + day;
  
      return [year, month, day].join('-');
  }
   
  const handleSubmitAdd =  (event) => {
    
    event.preventDefault();
    const formData = new FormData(event.target);
    koneksiMahasiswa
      .post("/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
     
 }
 const handleSubmitEdit =  (event) => {
    
  event.preventDefault();
  const address = "/"+event.target.nim.value;
  alert(address);
  //const formData = new FormData(event.target);
  const formData = {
    nim: event.target.nim.value,
    nama: event.target.nama.value,
    alamat: event.target.alamat.value,
    tanggal_lahir: event.target.tanggal_lahir.value
}
  alert(formData);
  koneksiMahasiswa
    .put( address,formData)
    .then((res) => {
      console.log(res);
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
   
}
  const handleAdd = (event) => {
    
     setAdd("show");
     setbtnAdd("hide");
     setEdit("hide");
 
      
  }
  const handleCancelAdd = (event) => {
    
     setAdd("hide");
     setbtnAdd("show");
     setEdit("hide");
 
      
  }
  const handleCancelEdit = (event) => {
    
    setAdd("hide");
    setbtnAdd("show");
    setEdit("hide");
    setNama("");
    setNim("");
    setAlamat("");
    setTanggal(formatDate("2018-07-22"));
    setFoto("");
     
 }
   const handleDelete = (event) => {
            event.preventDefault();
            var nim = event.target.value;
            koneksiMahasiswa.delete(`/${nim}`)
              .then(response => {
                console.log('Data berhasil dihapus:', response.data);
                setMahasiswa(
                  mahasiswa.filter((mahasiswa) => {
                     return mahasiswa.nim !== nim;
                  }))
             
                // Lakukan langkah-langkah lain setelah penghapusan data
              })
              .catch(error => {
                console.error('Gagal menghapus data:', error);
              })
          }

      const handleEdit = (event) => {
            event.preventDefault();
            var nim = event.target.value;
            
               const mhsEdit =  mahasiswa.filter((mahasiswa) => {
                     return mahasiswa.nim == nim;
                  });
                  if(mhsEdit!=null){

                    setNama(mhsEdit[0].nama);
                    setNim(mhsEdit[0].nim);
                    setAlamat(mhsEdit[0].alamat);
                    setTanggal(formatDate(mhsEdit[0].tanggal_lahir));
                    setFoto(mhsEdit[0].foto);
                    setAdd("hide");
                    setbtnAdd("show");
                    setEdit("show");

                  }
          }
  useEffect(() => {
      async function getMahasiswa() {
        const response = await koneksiMahasiswa.get("/").then(function (axiosResponse) {
            setMahasiswa(axiosResponse.data.data); 
     
         })
         .catch(function (error) {   
          alert('error from mahasiswa in api mahasiswa: '+error);
         });;
          }
      getMahasiswa();
    }, []);
  
   
if(mahasiswa==null){
return(
  <div>
    waiting...
  </div>
)
}else{

  return (
    <div>
     <button id="btnadd" onClick={handleAdd} className={statebutonadd}>add</button>
    
       <form id="formadd" className={stateadd} onSubmit={handleSubmitAdd} >
        <table border={0}>
            <tbody>
            <tr>
            <td> <label> nim:</label></td>
            <td><input type="text" id="nim" name="nim"/>
              
              </td>
        </tr>
        <tr>
            <td>  <label> nama:</label></td>
            <td><input type="text" id="nama"   name="nama" 
               /></td>
        </tr>
        <tr>
            <td>  <label> Foto:</label></td>
            <td>   <input
                    type="file" name="image"/>  </td>
        </tr>
        <tr>
            <td>  <label> Tanggal Lahir:</label></td>
            <td>  <input type="date" name="tanggal_lahir"
           min="1970-01-01" max="2025-12-31"/>
     </td>
        </tr>
        <tr>
            <td>  <label> alamat:</label></td>
            <td><textarea  id="address" style={{resize: "none"}}  name="alamat" ></textarea></td>
        </tr>
            </tbody>
          </table>
          <input type="submit" />
          <input type="button" value="cancel" onClick={handleCancelAdd} />
          </form>  
      <form id="formedit" className={stateedit} onSubmit={handleSubmitEdit}>
 
          <table border={0}>
            <tbody>
            <tr>
            <td> <label> nim:</label></td>
            <td><input type="text" id="nim"  value={statenim} name="nim"/>
              {/* onChange={handleOnchangeNim}  /> */}
              </td>
        </tr>
        <tr>
            <td>  <label> nama:</label></td>
            <td><input type="text" id="nama"  value={statenama} name="nama"
               onChange={(e) => setNama(e.target.value)}
               /></td>
        </tr>
        <tr>
            <td>  <label> Foto:</label></td>
            <td>  <img src={statefoto} width="80"/> </td>
        </tr>
        <tr>
            <td>  <label> Tanggal Lahir:</label></td>
            <td>  <input type="date" value={statetanggal} name="tanggal_lahir"  onChange={(e) => setTanggal(e.target.value)}
           min="1970-01-01" max="2025-12-31"/>
     </td>
        </tr>
        <tr>
            <td>  <label> alamat:</label></td>
            <td><textarea  id="address" style={{resize: "none"}} value={statealamat} name="alamat"  onChange={(e) => setAlamat(e.target.value)}></textarea></td>
        </tr>
            </tbody>
          </table>
          <input type="submit" />
          <input type="button" value="cancel" onClick={handleCancelEdit} />
          
          </form>  
        <br/>
        <br/>
       
    Tabel Mahasiswa hasil get Local Nodejs
    
        <table border={1}>
            <thead>
                <tr>
                  <td><b>Nim</b></td> 
                <td><b>Nama</b></td>
                <td><b>Foto</b></td>
                <td><b>Tanggal Lahir</b></td>
                <td><b>Alamat</b></td>
                <td colSpan={2}><b>Action</b></td>
                </tr>
            </thead>
            <tbody>
            {mahasiswa.map((mhs) => 
                <tr>
                    <td>{mhs.nim}</td>
                    <td>{mhs.nama}</td>
                    <td><img src={mhs.foto} width="80"/></td>
                    <td>{mhs.tanggal_lahir}</td>
                    <td>{mhs.alamat}</td>
                   <td><button onClick={handleEdit} value={mhs.nim}>edit</button></td>
                   <td><button onClick={handleDelete} value={mhs.nim}>delete</button></td>
                </tr>
           )}     
                   </tbody>
          </table>
         
          </div>
        )
}
  
  }
   