import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"

function BeneficiariesCard() {
  return (
    <Tabs defaultValue="add" className="w-[350px]">
      <TabsList className="grid w-full grid-cols-2 p-2 gap-x-1 tabline">
        <TabsTrigger value="add" className="tab-button">Añadir</TabsTrigger>
        <TabsTrigger value="delete" className="tab-button">Eliminar</TabsTrigger>
      </TabsList>
      <TabsContent value="add">
        <Card className="w-[350px] my-2">
          <CardHeader>
            <CardTitle>Añadir beneficiario</CardTitle>
          </CardHeader>
          <CardContent className="text-left">
            <Label>Address</Label>
            <Input id="addressAdd" placeholder="0x123..."/>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Añadir</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="delete">
        <Card className="w-[350px] my-2">
          <CardHeader>
            <CardTitle>Eliminar beneficiario</CardTitle>
          </CardHeader>
          <CardContent className="text-left">
            <Label>Address</Label>
            <Input id="addressDelete" placeholder="0x123..."/>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Eliminar</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default BeneficiariesCard
