import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"

function FundsCard() {
  return (
    <Tabs defaultValue="add" className="w-[350px]">
      <TabsList className="grid w-full grid-cols-2 p-2 gap-x-1 tabline">
        <TabsTrigger value="add" className="tab-button">Fondear</TabsTrigger>
        <TabsTrigger value="delete" className="tab-button">Retirar</TabsTrigger>
      </TabsList>
      <TabsContent value="add">
        <Card className="w-[350px] my-2">
          <CardHeader>
            <CardTitle>Añadir fondos</CardTitle>
          </CardHeader>
          <CardContent className="text-left">
            <Label>Cantidad</Label>
            <Input placeholder="50"/>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Añadir</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="delete">
        <Card className="w-[350px] my-2">
          <CardHeader>
            <CardTitle>Retirar fondos</CardTitle>
          </CardHeader>
          <CardContent className="text-left">
            <Label>Cantidad</Label>
            <Input disabled={ true } placeholder="Se retiran todos los fondos"/>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Retirar</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default FundsCard
