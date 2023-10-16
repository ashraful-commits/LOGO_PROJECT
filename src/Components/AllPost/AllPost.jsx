import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import getAllData from "../../Utility/GetAllData";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  Box,
  Button,
  IconButton,
  Input,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "../../firebase.confige";

import swal from "sweetalert";
import {
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineCloseCircle,
  AiOutlineStop,
} from "react-icons/ai";
import ReactPlayer from "react-player";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { ToastifyFunc } from "../../Utility/TostifyFunc";

import updateDocumentWithSnapshot from "../../Utility/UpdateDoc";
import getAllDataWithSnapshot from "../../Utility/GetAllData";

const AllPosts = () => {
  //=========================== all state
  const [Posts, setPosts] = useState([]);
  const [Id, setId] = useState(null);
  const [input, setInput] = useState({
    title: "",
    desc: "",
  });
  const [msg, setMsg] = useState("");
  const [suspendUserId, setSuspendUserId] = useState(null);
  const [time, setTime] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(null);
  const [open, setOpen] = useState(null);
  const [progress, setProgress] = useState(null);
  const [filterPosts, setFilterPosts] = useState([]); // State to store filtered posts

  const [suspend, setSuspend] = useState(false);
  //===========================handle edit change
  const handleInputChange = (e) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  //============================handle edit
  const handleEdit = (id) => {
    setId(id);
    setOpen(true);
    const singlePost = Posts.find((item) => item.dataId === id);
    console.log(singlePost);
    setInput({
      title: singlePost?.title,
      desc: singlePost?.desc,
    });
    setPreview(singlePost?.video);
  }; //=======================handle close
  const handleClose = () => {
    setOpen(false);
  };
  //=========================handle clear
  const handleClear = () => {
    setPreview(null);
  };
  //==========================handle video
  const handleVideo = async (e) => {
    const file = e.target.files[0];

    if (file) {
      //=========== Initialize Firebase Authentication
      const auth = getAuth(app);
      setLoading(true);

      try {
        //============= Get the currently signed-in user
        const user = auth?.currentUser;

        if (!user) {
          console.error("User is not authenticated");
          //=========== Handle the case where the user is not authenticated
          return;
        }

        //======= Create a reference to the Firebase Storage bucket
        const storage = getStorage();
        const storageRef = ref(
          storage,
          "postVideo/" + user?.uid + "/" + file.name
        );

        //========== Upload the file to Firebase Storage
        const uploadTask = uploadBytesResumable(storageRef, file);

        //=========== Attach a 'state_changed' event listener to track progress
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress.toFixed(0)); // Update the progress state
          },
          (error) => {
            setLoading(false); //============== Upload failed, set isUploading to false
            console.error("Error uploading file:", error);
          },
          async () => {
            //=========== Upload complete, set isUploading to false
            setLoading(false);
            //============== Get the download URL of the uploaded file
            const downloadURL = await getDownloadURL(storageRef);
            setPreview(downloadURL);
          }
        );
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    }
  };
  //==========================delete post
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
          <video
            controls
            style={{ width: "100px", height: "80px" }}
            src={row.video}
          ></video>
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
      selector: (row) => (
        <p
          style={{
            width: " 200px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row.title}
        </p>
      ),
    },
    {
      name: "Desc",
      selector: (row) => (
        <p
          style={{
            width: " 200px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row.desc}
        </p>
      ),
    },

    {
      name: "Action",
      selector: (row) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            columnGap: "5px",
            gap: "10px",
            zIndex: 0,
          }}
        >
          <button
            style={{ border: "none", color: "green" }}
            onClick={() => handleEdit(row.dataId)}
          >
            <Tooltip title="Edit">
              <IconButton>
                <FaEdit fontSize={"18"} color="#71bb41" />
              </IconButton>
            </Tooltip>
          </button>
          <button
            style={{ border: "none", color: "red" }}
            onClick={() => handlePostDelete(row.dataId)}
          >
            <Tooltip title="Permanent delete">
              <IconButton>
                <FaTrash fontSize={"18"} color="red" />
              </IconButton>
            </Tooltip>
          </button>
          <button
            style={{ border: "none", color: "green" }}
            color="primary"
            onClick={() => handleApprove(row.dataId, row.pending)}
          >
            <Tooltip title="Approve">
              <IconButton>
                <AiOutlineCheck fontSize={"18"} color="#71bb41" />
              </IconButton>
            </Tooltip>
          </button>
          <button
            style={{ border: "none", color: "red" }}
            color="secondary"
            onClick={() => handleDecline(row.dataId, row.pending, row.decline)}
          >
            <Tooltip title="Decline">
              <IconButton>
                <AiOutlineCloseCircle fontSize={"18"} color="red" />
              </IconButton>
            </Tooltip>
          </button>

          <button
            style={{ border: "none", color: "red" }}
            onClick={() => handleSuspend(row.dataId, row.id)}
          >
            <Tooltip title="Suspend">
              <IconButton>
                <AiOutlineStop fontSize={"18"} color="red" />
              </IconButton>
            </Tooltip>
          </button>
        </Box>
      ),
    },
  ];
  //========================== Handle closing the modal
  const handlePostEdit = async (e) => {
    e.preventDefault();
    const db = getFirestore();
    const postRef = doc(db, "Posts", Id);
    const updateData = {
      title: input.title,
      desc: input.desc,
      video: preview,
    };
    await updateDoc(postRef, updateData);
    // Optionally, update the local state with the updated data
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.postId === Id ? { ...post, ...updateData } : post
      )
    );
    setId(null);
    setOpen(false);
    ToastifyFunc("Post Updated!", "success");
  };
  //========================== approve post
  const handleApprove = async (id, pending) => {
    const db = getFirestore(app);

    try {
      const updateRef = doc(db, "Posts", id);
      await updateDoc(updateRef, { pending: !pending });

      setPosts([...Posts.filter((item) => item.dataId != id)]);
      ToastifyFunc("Approved", "success");
    } catch (error) {
      console.log(error);
    }
  };
  //========================== post reject
  const handleDecline = async (id, pending, decline) => {
    const db = getFirestore(app);
    console.log(id, pending);
    try {
      const updateRef = doc(db, "Posts", id);
      await updateDoc(updateRef, { pending: !pending, decline: !decline });

      setPosts([...Posts.filter((item) => item.dataId !== id)]);
      ToastifyFunc("Decline", "success");
    } catch (error) {
      console.log(error);
    }
  };
  //========================== user suspend
  const handleSuspend = (id, uId) => {
    setSuspend(!suspend);
    setId(id);
    setSuspendUserId(uId);
  };
  //=========================== get all post
  useEffect(() => {
    const unsubscribe = getAllDataWithSnapshot("Posts", (AllPosts) => {
      setPosts(AllPosts);
    });
    return () => unsubscribe;
  }, []);
  //========================== handle suspend message
  const handleSubmitSuspend = async (e) => {
    e.preventDefault();

    try {
      //===================update post suspend
      await updateDocumentWithSnapshot("Posts", Id, {
        pending: false,
        suspended: { status: true, endTime: time, msg: msg },
      });
      //============================update user suspend
      await updateDocumentWithSnapshot("users", suspendUserId, {
        status: {
          user: "suspend",
          msg: `${msg} until ${time}`,
          time: time,
        },
      });
      setSuspend(false);
      setPosts([...Posts.filter((item) => item.dataId !== Id)]);
      //======================toast message
      ToastifyFunc(`You are suspended until ${time}`, "warning");
      setSuspend(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (Posts) {
      const filteredPosts = Posts?.filter((item) => item.pending === true);

      setFilterPosts(filteredPosts);
    }
  }, [Posts]);

  return (
    <div style={{ position: "relative" }}>
      {suspend && (
        <div
          style={{
            position: "absolute",
            top: "-150%",
            right: "25%",
            width: "300px",
            height: "300px",
            boxShadow: " 0 0 10px #32d105",
            borderRadius: "10px",
            zIndex: 999999,
            backgroundColor: "white",
          }}
        >
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "20px",
              gap: "10px",
              textAlign: "center",
            }}
            onSubmit={handleSubmitSuspend}
          >
            <h4
              style={{
                color: "#71bb41",
                textTransform: "uppercase",
              }}
            >
              Suspend message
            </h4>
            <input
              style={{
                height: "40px",
                border: "none",
                borderRadius: "50px",
                padding: "0 10px",
                textTransform: "uppercase",
                fontWeight: "bold",
              }}
              type="date"
              onChange={(e) => setTime(e.target.value)}
              name=""
              id=""
            />
            <input
              style={{
                height: "40px",
                border: "none",
                borderRadius: "50px",
                padding: "0 10px",
              }}
              onChange={(e) => setMsg(e.target.value)}
              type="text"
              placeholder="Message"
              name=""
              id=""
            />
            <button
              type="submit"
              style={{
                height: "40px",
                border: "none",
                borderRadius: "50px",
                backgroundColor: "#71bb41",
                color: "white",
                padding: "0 10px",
                textTransform: "capitalize",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              suspend
            </button>
          </form>
        </div>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "400px",

            bgcolor: "white",
          }}
        >
          <form onSubmit={handlePostEdit}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                padding: "15px",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  bgcolor: "#71bb42",
                  width: "100%",
                  textAlign: "center",
                  padding: "5px 0",
                  color: "white",
                  marginBottom: "10px",
                }}
              >
                {Id ? "Edit Post" : "Add new Post"}
              </Typography>

              <label htmlFor="postVide">
                <Box
                  sx={{
                    width: "380px",
                    height: "200px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  {loading ? (
                    <Typography sx={{ fontSize: "24px" }}>
                      {progress}%
                    </Typography>
                  ) : preview ? (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <ReactPlayer
                        style={{
                          width: "100%",
                          bgcolor: "black",
                          height: "100%",
                        }}
                        url={preview}
                        width="100%"
                        height="100%"
                        controls={true}
                        playing={true}
                      />
                      <button
                        onClick={handleClear}
                        style={{
                          backgroundColor: "white",
                          position: "absolute",
                          top: 0,
                          right: 0,
                          zIndex: 99999,
                          border: "none",
                          padding: "5px",
                          borderRadius: "100%",
                        }}
                        className="previewClear"
                      >
                        <AiOutlineClose />
                      </button>
                    </Box>
                  ) : (
                    <label
                      style={{
                        overflow: "hidden",
                        width: "100%",
                        height: "100%",
                      }}
                      htmlFor="postVide0"
                    >
                      <img
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        src="https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg"
                        alt="preview"
                      />
                    </label>
                  )}
                </Box>
              </label>
              <TextField
                id="outlined-multiline-flexible"
                label="Title"
                multiline
                maxRows={4}
                name="title"
                value={input.title}
                onChange={handleInputChange}
                sx={{ width: "100%", marginBottom: "10px" }}
              />
              <TextField
                id="outlined-multiline-flexible"
                label="Description"
                multiline
                maxRows={4}
                sx={{ width: "100%" }}
                name="desc"
                value={input.desc}
                onChange={handleInputChange}
              />

              <Input
                sx={{ display: "none" }}
                type="file"
                id="postVide0"
                onChange={handleVideo}
              />

              <Button
                type="submit"
                sx={{
                  bgcolor: "#71bb42",
                  width: "100%",
                  textAlign: "center",
                  padding: "5px 0",
                  color: "white",
                  marginTop: "10px",
                  "&:hover": {
                    color: "#068a02",
                  },
                }}
              >
                {Id ? "Save" : "Post"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
      <DataTable data={filterPosts} columns={columns} />
    </div>
  );
};
//===========================export
export default AllPosts;
