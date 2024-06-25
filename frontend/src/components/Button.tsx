const Button = ({onClick, children} : {onClick: () => void, children: React.ReactNode}) => {
  return (
    <button onClick={onClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-3xl px-12 py-5 rounded">
      {children}
    </button>
  )
}
export default Button