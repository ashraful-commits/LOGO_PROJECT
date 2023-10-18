import { useEffect, useState } from "react";

import DataTable from "react-data-table-component";
import getAllData from "../../Utility/GetAllData";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Box, Button, ButtonBase, MenuItem, Select } from "@mui/material";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "../../firebase.confige";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { ToastifyFunc } from "../../Utility/TostifyFunc";
import getAllDataWithSnapshot from "../../Utility/GetAllData";

const User = () => {
  const [Users, setUsers] = useState([]);
  const [unsubscribe, setUnsubscribe] = useState(null);
  //=========================handle onchange
  const handleOnchange = async (e, id) => {
    const newRole = e.target.value;

    //============= Update the user's role in the state
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === id) {
          return { ...user, role: newRole };
        }
        return user;
      })
    );
    //===================get fire store
    const db = getFirestore(app);
    try {
      const updateRef = doc(db, "users", id);
      await updateDoc(updateRef, { role: newRole });
      ToastifyFunc("Role updated!", "success");
    } catch (error) {
      console.log(error);
    }
  };
  //============================== delete post
  const handleUserDelete = async (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const db = getFirestore();
        await deleteDoc(doc(db, "users", id));
        swal("Poof! Your imaginary file has been deleted!", {
          icon: "success",
        });
        setUsers([...Users.filter((item) => item.id !== id)]);
      } else {
        swal("Your imaginary file is safe!");
      }
    });
  };
  //=========================columns
  const columns = [
    {
      name: "Photo",
      selector: (row) => {
        return row?.photoURL ? (
          <img style={{ width: "30px" }} src={row.photoURL} alt="User Photo" />
        ) : (
          <img
            style={{ width: "30px" }}
            src="https://img.freepik.com/premium-vector/young-smiling-man-avatar-man-with-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-3d-vector-people-character-illustration-cartoon-minimal-style_365941-860.jpg"
            alt="Default Photo"
          />
        );
      },
    },
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Role",
      selector: (row) => (
        <>
          <Select
            sx={{ height: "35px", width: "100px", marginRight: "50px" }}
            onChange={(e) => handleOnchange(e, row.id)}
            label="Role"
            value={row.role} // Use row.role as the value
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </>
      ),
    },
    {
      name: "Action",
      selector: (row) => (
        <Box
          sx={{
            width: "100px",
            display: "flex",
            alignItems: "center",
            columnGap: "5px",
          }}
        >
          <button
            style={{
              backgroundColor: "#71bb41",
              border: "none",
              padding: "5px",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FaEdit />
          </button>
          <button
            style={{
              backgroundColor: "#71bb41",
              border: "none",
              padding: "5px",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => handleUserDelete(row.id)}
          >
            <FaTrash />
          </button>
        </Box>
      ),
    },
  ];

  //===============================get all users
  useEffect(() => {
    const userData = getAllDataWithSnapshot("users", (allUser) => {
      setUsers(allUser);
    });

    return userData;
  }, []);
  return (
    <div style={{ width: "100%", position: "relative", overflow: "auto" }}>
      <Box sx={{ width: "100%", overflow: "auto" }}>
        {/* //=======================data table  */}
        <DataTable data={Users} columns={columns} />
      </Box>
    </div>
  );
};

export default User;
