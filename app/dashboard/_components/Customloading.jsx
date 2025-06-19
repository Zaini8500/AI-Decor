import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  import Image from "next/image";
  
  function Customloading({ loading }) {
    return (
      <AlertDialog open={loading}>
        <AlertDialogContent className="bg-white flex items-center justify-center flex-col space-y-4">
          <AlertDialogTitle>Loading...</AlertDialogTitle>
          <Image src="/loading.gif" alt="loading" width={100} height={100} />
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  
  export default Customloading;
  