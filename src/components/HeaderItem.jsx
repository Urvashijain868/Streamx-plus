
function HeaderItem({name,Icon}) {
  return (
    <div className='text-white flex items-center gap-3
    text-[18px] font-semibold cursor-pointer hover:underline
    underline-offset-8 mb-3'>
        <Icon className='text-[20px] '/>
        <span className="">{name}</span>
    </div>
  )
}

export default HeaderItem;