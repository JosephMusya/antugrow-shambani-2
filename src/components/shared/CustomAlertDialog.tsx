import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

export function CustomAlertDialog({handleClick}:{handleClick:()=>void}) {

  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>🎉 Congratulations on your first milestone!</AlertDialogTitle>
          <AlertDialogDescription>
            Let's complete setting up your profile to get the most out of your experience.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={handleClick}
            className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
          >
            Complete Profile
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
