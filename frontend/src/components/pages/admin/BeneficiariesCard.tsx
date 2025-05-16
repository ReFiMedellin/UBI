import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { isAddress } from "viem"
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { UBI_CONTRACT_ABI, UBI_CONTRACT_ADDRESS } from "@/constants"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"

function BeneficiariesCard() {
  const { toast } = useToast()

  const { writeContract, isPending, data: hash } = useWriteContract({
    mutation: {
      onError: (error) => {
        console.error(error);
        toast({
          title: 'Error en la transacción',
          description: error.message,
          variant: 'destructive',
        });
      },
    },
  })

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleAddSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()

    const formData = new FormData(evt.currentTarget)
    const address = formData.get("address")?.toString().trim() ?? ""

    if (!isAddress(address)) {
      toast({
        title: "¡Address inválida!",
        variant: "destructive",
      })
      return
    }

    writeContract({
      abi: UBI_CONTRACT_ABI,
      address: UBI_CONTRACT_ADDRESS,
      functionName: "addBeneficiary",
      args: [address],
    })
  }

  const handleDeleteSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()

    const formData = new FormData(evt.currentTarget)
    const address = formData.get("address")?.toString().trim() ?? ""

    if (!isAddress(address)) {
      toast({
        title: "¡Address inválida!",
        variant: "destructive",
      })
      return
    }

    writeContract({
      abi: UBI_CONTRACT_ABI,
      address: UBI_CONTRACT_ADDRESS,
      functionName: "removeBeneficiary",
      args: [address],
    })
  }

  useEffect(() => {
    if (isSuccess)
      toast({
        title: "¡Transacción exitosa!",
      })
  }, [isSuccess])
  
  return (
    <Tabs defaultValue="add" className="w-full h-full flex-1">
      <TabsList className="grid w-full grid-cols-2 p-1 gap-x-2 bg-gray-100 rounded-xl mb-4">
        <TabsTrigger value="add" className="tab-button data-[state=active]:bg-cyan-600 data-[state=active]:text-white data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-700 rounded-lg transition-colors">Añadir</TabsTrigger>
        <TabsTrigger value="delete" className="tab-button data-[state=active]:bg-cyan-600 data-[state=active]:text-white data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-700 rounded-lg transition-colors">Eliminar</TabsTrigger>
      </TabsList>
      <TabsContent value="add">
        <Card className="w-full max-w-[400px] mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
        <form onSubmit={ handleAddSubmit } >
          <CardHeader>
            <CardTitle className="text-gray-800 text-lg font-semibold">Añadir beneficiario</CardTitle>
          </CardHeader>
          <CardContent className="text-left p-0 mb-4">
            <Label className="text-gray-700 mb-2">Address</Label>
            <Input name="address" id="addressAdd" placeholder="0x123..." className="mt-1"/>
          </CardContent>
          <CardFooter className="p-0">
            <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg" loading={isPending || isLoading}>Añadir</Button>
          </CardFooter>
        </form>
        </Card>
      </TabsContent>
      <TabsContent value="delete">
        <Card className="w-full max-w-[400px] mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
        <form onSubmit={ handleDeleteSubmit }>
          <CardHeader>
            <CardTitle className="text-gray-800 text-lg font-semibold">Eliminar beneficiario</CardTitle>
          </CardHeader>
          <CardContent className="text-left p-0 mb-4">
            <Label className="text-gray-700 mb-2">Address</Label>
            <Input name="address" id="addressDelete" placeholder="0x123..." className="mt-1"/>
          </CardContent>
          <CardFooter className="p-0">
            <Button type="submit" loading={isPending || isLoading} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Eliminar</Button>
          </CardFooter>
        </form>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default BeneficiariesCard
