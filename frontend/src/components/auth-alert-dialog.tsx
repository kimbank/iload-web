import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"

export function AuthAlertDialog() {
  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>로그인 후 사용가능합니다.</AlertDialogTitle>
          <AlertDialogDescription>
            메인 페이지로 이동하거나, 로그인 페이지로 이동하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <span className="text-sm text-muted-foreground flex gap-2 w-full justify-end">
            <Link href="/">
              <AlertDialogCancel>홈으로</AlertDialogCancel>
            </Link>
            <Link href="/signin">
              <AlertDialogAction>로그인</AlertDialogAction>
            </Link>
          </span>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
