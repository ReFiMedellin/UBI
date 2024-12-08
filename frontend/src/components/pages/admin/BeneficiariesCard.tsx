import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { subsidyProgramAbi } from "@/generated"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { isAddress } from "viem"
import { useWriteContract } from "wagmi"

function BeneficiariesCard() {
  const contractAddress = "0x1A6FBc7b51E55C6D4F15c8D5CE7e97daEA699ecf"
  const { writeContract } = useWriteContract()

  const handleAddSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()

    const formData = new FormData(evt.currentTarget)
    const address = formData.get("address")?.toString().trim() ?? ""

    if (!isAddress(address))
      return

    writeContract({
      abi: subsidyProgramAbi,
      address: contractAddress,
      functionName: "addBeneficiary",
      args: [address],
    })
  }

  const handleDeleteSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()

    const formData = new FormData(evt.currentTarget)
    const address = formData.get("address")?.toString().trim() ?? ""

    if (!isAddress(address))
      return

    writeContract({
      abi: subsidyProgramAbi,
      address: contractAddress,
      functionName: "removeBeneficiary",
      args: [address],
    })
  }
  
  return (
    <Tabs defaultValue="add" className="w-[350px]">
      <TabsList className="grid w-full grid-cols-2 p-2 gap-x-1 tabline">
        <TabsTrigger value="add" className="tab-button">Añadir</TabsTrigger>
        <TabsTrigger value="delete" className="tab-button">Eliminar</TabsTrigger>
      </TabsList>
      <TabsContent value="add">
        <Card className="w-[350px] my-2">
        <form onSubmit={ handleAddSubmit } >
          <CardHeader>
            <CardTitle>Añadir beneficiario</CardTitle>
          </CardHeader>
          <CardContent className="text-left">
            <Label>Address</Label>
            <Input name="address" id="addressAdd" placeholder="0x123..."/>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Añadir</Button>
          </CardFooter>
        </form>
        </Card>
      </TabsContent>
      <TabsContent value="delete">
        <Card className="w-[350px] my-2">
        <form onSubmit={ handleDeleteSubmit }>
          <CardHeader>
            <CardTitle>Eliminar beneficiario</CardTitle>
          </CardHeader>
          <CardContent className="text-left">
            <Label>Address</Label>
            <Input name="address" id="addressDelete" placeholder="0x123..."/>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Eliminar</Button>
          </CardFooter>
        </form>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default BeneficiariesCard
