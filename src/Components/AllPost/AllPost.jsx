import { useEffect, useState } from "react";

import DataTable from "react-data-table-component";
import getAllData from "../../Utility/GetAllData";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Box, Button } from "@mui/material";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "../../firebase.confige";
import { toast } from "react-toastify";
import swal from "sweetalert";

const AllPosts = () => {
  const [Posts, setPosts] = useState([]);
  const [unsubscribe, setUnsubscribe] = useState(null);
  const handleInput = async (e, id) => {
    const db = getFirestore(app);
    const newChecked = e.target.checked;
    console.log(newChecked);

    try {
      const updateRef = doc(db, "Posts", id);
      await updateDoc(updateRef, { status: newChecked });
      const updatedPosts = Posts.map((item) => {
        if (item.id === id) {
          return { ...item, status: newChecked };
        }
        return item;
      });
      console.log(newChecked);
      setPosts(updatedPosts);
      toast.success("Permission updated!", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      console.log(error);
    }
  };
  //=============================delete post
  const handlePostDelete = async (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const db = getFirestore();
        await deleteDoc(doc(db, "Posts", id));
        swal("Poof! Your imaginary file has been deleted!", {
          icon: "success",
        });
        setPosts([...Posts.filter((item) => item.id !== id)]);
      } else {
        swal("Your imaginary file is safe!");
      }
    });
  };
  const columns = [
    {
      name: "Photo",
      selector: (row) => {
        return row?.video ? (
          <video controls style={{ width: "30px" }} src={row.video}></video>
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
      name: "title",
      selector: (row) => row.title,
    },
    {
      name: "Desc",
      selector: (row) => row.desc,
    },
    {
      name: "status",
      selector: (row) => (
        <input
          onChange={(e) => handleInput(e, row.dataId)}
          checked={row?.status ? true : false}
          type="checkbox"
        />
      ),
    },
    {
      name: "Action",
      selector: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", columnGap: "5px" }}>
          <Button variant="outlined">
            <FaEdit />
          </Button>
          <Button
            onClick={() => handlePostDelete(row.dataId)}
            variant="outlined"
          >
            <FaTrash />
          </Button>
        </Box>
      ),
    },
  ];

  //===========================
  useEffect(() => {
    const fetchData = async () => {
      const userData = await getAllData("Posts");
      setPosts(userData);
    };

    const setupRealTimeUpdates = () => {
      const unsubscribe = getAllData("Posts").then((data) => {
        setPosts(data);
      });
      setUnsubscribe(unsubscribe);
    };

    fetchData();
    setupRealTimeUpdates();
  }, [Posts]);
  return (
    <div>
      <DataTable data={Posts} columns={columns} />
    </div>
  );
};

export default AllPosts;
