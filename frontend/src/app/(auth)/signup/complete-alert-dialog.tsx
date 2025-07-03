import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"

export function CompleteAlertDialog({ isOpen }: { isOpen: boolean }) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>로그인이 완료되었습니다.</AlertDialogTitle>
          <AlertDialogDescription>
            로그인 페이지로 이동하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <span className="text-sm text-muted-foreground flex gap-2 w-full justify-end">
            <AlertDialogCancel>취소</AlertDialogCancel>
            <Link href="/signin">
              <AlertDialogAction>로그인</AlertDialogAction>
            </Link>
          </span>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CompleteAlertDialog;
