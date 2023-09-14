import React, { useState } from 'react'
import SearchBar from '../components/SearchComponents/SearchBar'
import Loading from '../components/SearchComponents/Loading'
import User from '../components/SearchComponents/User'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Search() {

  const notify = (value)=>{
    return toast.info(`Added ${value}`, {
      position: "bottom-center",
      autoClose: 2222,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  };

  const[isLoading,SetisLoading]=useState(false);
  const [users,SetUsers]=useState([])
  const[query,setQuery]=useState('');
  const[resultsEmpty,setResultsEmpty]=useState(false);


  const onChangeTextHandler=(e)=>{
    setQuery(e.target.value);
    if(!e.target.value)
    {
      return;
    }

   const timeout=setTimeout(() => {
      searchHandler()
    }, 1000);

    return ()=>{
      clearTimeout(timeout);
    }
  }

  const searchHandler=async()=>{

    SetisLoading(true);
    const cookie=localStorage.getItem('jwt');
    const response=await fetch(`http://127.0.0.1:4000/api/v1/users?search=${query}`,{
    headers:{
      'Content-type':'application/json',
      'Authorization':`Bearer ${cookie}`
    }
  })
  const data=await response.json();
  SetisLoading(false);
  SetUsers(data.users)
  if(data.users.length===0)
  setResultsEmpty(true)
  else
  setResultsEmpty(false);

  }

  const accessChatHandler=(value)=>{
    notify(value);
  }

  return (
    <div className='w-[80vw] relative flex flex-col'>
      <ToastContainer/>
        <SearchBar onChange={onChangeTextHandler} searchHandler={searchHandler} ></SearchBar>
        <div className=' w-[100%] flex box-border justify-center py-2 relative'>
        {!isLoading&&resultsEmpty&&<p>0 matching results found</p>}
       {isLoading&&<Loading></Loading>}
       {!isLoading&&users.length>0&&( <div className='w-[60%] border-[1px] rounded-md border-[#acacac] px-[1%] py-[1%] flex flex-col'>
{users.map((data,index)=><User accessChat={accessChatHandler} values={data} key={index}></User>)}
</div>)}
    </div>
    </div>
  )
}