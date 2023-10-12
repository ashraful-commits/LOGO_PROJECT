import { useState, useEffect } from "react";

function CustomScrollEffect() {
  const initialData = [...Array(10).keys()];
  const dataItemHeight = 30; // Height of each data item in vh
  const windowHeight = window.innerHeight;

  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const totalDataHeight = data.length * dataItemHeight * windowHeight;
      const scrollOffset = windowHeight * 0.75; // Adjust this threshold as needed

      if (
        !isLoading &&
        !noMoreData &&
        scrollPosition + windowHeight + scrollOffset >= totalDataHeight
      ) {
        setIsLoading(true);

        // Simulate loading more data
        setTimeout(() => {
          const newData = [...data, ...Array(5).fill(null)];
          setData(newData);
          setIsLoading(false);

          if (newData.length >= 20) {
            setNoMoreData(true);
          }
        }, 2000); // Loader delay set to 2 seconds
      }

      // Stop scrolling when there's no more data
      if (noMoreData) {
        window.removeEventListener("scroll", handleScroll);
      }
    };

    // Add the scroll event listener initially
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [data, isLoading, noMoreData]);

  return (
    <div style={{ height: `${data.length * dataItemHeight * 100}vh` }}>
      {data.map((item, index) => (
        <div
          key={index}
          style={{
            height: `${dataItemHeight}vh`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: index % 2 === 0 ? "lightgray" : "lightblue",
          }}
        >
          <p>Data Item {item}</p>
        </div>
      ))}

      {isLoading && <p>Loading...</p>}
      {noMoreData && <p>No More Data</p>}
    </div>
  );
}

export default CustomScrollEffect;
