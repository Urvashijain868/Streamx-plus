import GlobalApi from "../Services/GlobalApi";
import MovieCard from "./MovieCard.jsx";
import {HiChevronLeft,HiChevronRight} from 'react-icons/hi2';
import {useEffect,useRef,useState} from "react";

const screenWidth=window.innerWidth;


function MovieList({genreId}) {
    const[movieList,setMovieList]=useState([])
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);
        const elementRef=useRef(null);


    useEffect(() => {
        GlobalApi.getMovieByGenreId(genreId).then((resp) => {
            console.log(resp.data.results);
            setMovieList(resp.data.results);
        });
    }, [genreId]);

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
  elementRef.current.scrollLeft += screenWidth-110;
}

const sliderLeft = () => {
  elementRef.current.scrollLeft -= screenWidth-110;
}


  return (
      <div className='relative'>
        {showLeft && (<HiChevronLeft className='hidden md:block text-white text-[50px] absolute
          cursor-pointer left-0 top-[50%] -translate-y-1/2 z-50 bg-black bg-opacity-50 rounded-full 
          p-2 hover:bg-opacity-75 ' 
          onClick={sliderLeft}/>
        )}
    <div className='flex overflow-x-auto gap-8 scrollbar-hide scroll-smooth
    pt-5 px-3 pb-5' ref={elementRef}>
    {movieList.map((item)=>(
       
       <MovieCard key={item.id} movie={item}/>
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

export default MovieList;