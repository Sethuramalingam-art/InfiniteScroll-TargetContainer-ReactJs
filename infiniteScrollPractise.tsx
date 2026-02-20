import { useEffect, useState } from "react";
import useThrottle from "./hooks/useThrottle";

const InfiniteScrollPractise = () => {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleContainerScroll = (e) => {
    const targetContainer = e.target;
    if (
      targetContainer.clientHeight + targetContainer.scrollTop >=
      targetContainer.scrollHeight
    ) {
      setCount((prevCount) => prevCount + 10);
    }
  };

  const thorttleFunc = useThrottle(handleContainerScroll, 10000);
  useEffect(() => {
    // For window scroll
    // const handleScroll = () => {
    //   if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
    //     console.log("reached bottom");
    //   }
    // };
    // window.addEventListener("scroll", handleScroll);
    if (isLoading) return;

    // for target container scroll
    const container = document.querySelector(".infinite-scroll-container");
    container.addEventListener("scroll", thorttleFunc);

    return () => {
      // window.removeEventListener("scroll", handleScroll);
      container.removeEventListener("scroll", thorttleFunc);
    };
  }, [isLoading, thorttleFunc]);

  useEffect(() => {
    // Simulating API call to fetch more data
    const fetchData = async () => {
      setIsLoading(true);
      const response = await fetch(
        `https://dummyjson.com/products?limit=10&skip=${count}`,
      );
      const newResults = await response.json();
      setResults((prevResults) => {
        const existIds = new Set(prevResults.map((item) => item.id));
        console.log(existIds);
        const filteredResults = newResults.products.filter(
          (item) => !existIds.has(item.id),
        );
        return [...prevResults, ...filteredResults];
      });
      setIsLoading(false);
    };

    fetchData();
  }, [count]);
  return (
    <div className="infinite-scroll-container">
      {results.map((item, index) => (
        <div key={item.id} style={{ border: "1px solid", margin: "10px" }}>
          {item.title}
        </div>
      ))}
    </div>
  );
};

export default InfiniteScrollPractise;
