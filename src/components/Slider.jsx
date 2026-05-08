import GlobalApi from "../Services/GlobalApi";
import { useEffect,useRef,useState } from "react";
import {HiChevronLeft,HiChevronRight} from 'react-icons/hi2';
const IMAGE_BASE_URL="https://image.tmdb.org/t/p/original";


function Slider() {
   const[movieList,setMovieList] = useState([]);
   const [showLeft, setShowLeft] = useState(false);
   const [showRight, setShowRight] = useState(true);
    const elementRef=useRef(null);

  const getTrendingMovies = () => {
    // ✅ GlobalApi.getTrendingVideos() call karo
    GlobalApi.getTrendingVideos().then((resp) => {
      console.log(resp.data.results);
      setMovieList(resp.data.results);
    }).catch(err => {
      console.error("API Error:", err);
    });
  };

useEffect(() => {
  getTrendingMovies();
}, []);

const handleScroll = () => {
  const el = elementRef.current;
  if (!el) return;

  setShowLeft(el.scrollLeft > 0);
  setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
};

useEffect(() => {
  const el = elementRef.current;
  if (!el) return;

  el.addEventListener("scroll", handleScroll);

  return () => el.removeEventListener("scroll", handleScroll);
}, []);

const sliderRight = () => {
elementRef.current.scrollLeft += elementRef.current.clientWidth;
}

const sliderLeft = () => {
elementRef.current.scrollLeft -= elementRef.current.clientWidth;
}

return (
  <div className='relative'>
    {showLeft && (<HiChevronLeft className='hidden md:block text-white text-[50px] absolute
      cursor-pointer left-0 top-[50%] -translate-y-1/2 z-50 bg-black bg-opacity-50 rounded-full 
      p-2 hover:bg-opacity-75 ' 
      onClick={sliderLeft}/>
    )}

    <div className='flex overflow-x-auto overflow-y-visible w-full scrollbar-hide scroll-smooth snap-x snap-mandatory' 
         ref={elementRef}>
      {movieList.map((item) => (
        <img 
          key={item.id}  // Add key prop
          src={IMAGE_BASE_URL + item.backdrop_path} 
          className='min-w-full  h-[400px] md:h-[400px] object-cover  object-[center_25%] snap-start
                      rounded-md hover:border-[4px] border-gray-400 tranition-all duration-100 ease-in'
          />
      ))}

    {showRight && (<HiChevronRight className='hidden md:block text-white text-[50px] absolute
       cursor-pointer right-0 top-[50%] -translate-y-1/2 z-50 bg-black bg-opacity-50 rounded-full 
      p-2 hover:bg-opacity-75' 
      onClick={sliderRight}/>
    )}
    </div>
  </div>
)
}

export default Slider