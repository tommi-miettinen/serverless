export function Google(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" {...props}>
      <path
        d="M24 12.276c0-.816-.067-1.636-.211-2.438H12.242v4.62h6.612a5.549 5.549 0 0 1-2.447 3.647v2.998h3.945C22.669 19.013 24 15.927 24 12.276Z"
        fill="#4285F4"
      />
      <path
        d="M12.241 24c3.302 0 6.086-1.063 8.115-2.897l-3.945-2.998c-1.097.732-2.514 1.146-4.165 1.146-3.194 0-5.902-2.112-6.873-4.951H1.302v3.09C3.38 21.444 7.612 24 12.242 24Z"
        fill="#34A853"
      />
      <path d="M5.369 14.3a7.053 7.053 0 0 1 0-4.595v-3.09H1.302a11.798 11.798 0 0 0 0 10.776L5.369 14.3Z" fill="#FBBC04" />
      <path
        d="M12.241 4.75a6.727 6.727 0 0 1 4.696 1.798l3.495-3.425A11.898 11.898 0 0 0 12.243 0C7.611 0 3.38 2.558 1.301 6.615l4.067 3.09C6.336 6.862 9.048 4.75 12.24 4.75Z"
        fill="#EA4335"
      />
    </svg>
  );
}

const SignWithGoogleButton = () => {
  return (
    <button className="bg-black border border-gray-700 text-white w-full flex px-5 py-2.5 items-center justify-center rounded-lg gap-2 hover:bg-opacity-80">
      <Google className="w-4 h-4" />
      <span>Sign in with Google</span>
    </button>
  );
};

export default SignWithGoogleButton;
