import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink } from 'lucide-react';

function TestMenu() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  // Función para generar enlace de Celoscan
  const getCeloscanUrl = (hash: string) => {
    return `https://celoscan.io/tx/${hash}`;
  };

  // Simular hash de transacción
  const mockHash = "0x83435365a1b2c3d4e5f678901234567890123456789012345678901234567890";

  const simulateSuccessClaim = () => {
    const celoscanUrl = getCeloscanUrl(mockHash);
    toast({
      title: "¡Subsidio reclamado exitosamente! 🎉",
      description: (
        <div className="space-y-2">
          <p>Tu subsidio ha sido reclamado correctamente.</p>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Hash:</span>
            <a 
              href={celoscanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-blue-600 hover:text-blue-800 hover:bg-gray-200 transition-colors"
            >
              {mockHash.slice(0, 10)}...{mockHash.slice(-8)}
            </a>
          </div>
        </div>
      ),
      duration: 8000,
    });
  };

  const simulatePendingTransaction = () => {
    const celoscanUrl = getCeloscanUrl(mockHash);
    toast({
      title: "⏳ Transacción enviada",
      description: (
        <div className="space-y-2">
          <p>Tu transacción está siendo procesada en la blockchain.</p>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Hash:</span>
            <a 
              href={celoscanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-blue-600 hover:text-blue-800 hover:bg-gray-200 transition-colors"
            >
              {mockHash.slice(0, 10)}...{mockHash.slice(-8)}
            </a>
          </div>
        </div>
      ),
      duration: 5000,
    });
  };

  const simulateError = () => {
    toast({
      title: '❌ Error al reclamar el subsidio',
      description: (
        <div className="space-y-2">
          <p className="text-sm">Insufficient funds for gas * price + value</p>
          <p className="text-xs text-gray-500">
            Verifica que tengas suficiente gas y que tu wallet esté conectada.
          </p>
        </div>
      ),
      variant: 'destructive',
      duration: 10000,
      action: (
        <Button variant="outline" size="sm" onClick={simulateSuccessClaim}>
          Intentar de nuevo
        </Button>
      ),
    });
  };

  const simulateDonationSuccess = () => {
    const celoscanUrl = getCeloscanUrl(mockHash);
    toast({
      title: '🎉 ¡Fondos donados exitosamente!',
      description: (
        <div className="space-y-2">
          <p>Tu donación ha sido procesada correctamente.</p>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Hash:</span>
            <a 
              href={celoscanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-blue-600 hover:text-blue-800 hover:bg-gray-200 transition-colors"
            >
              {mockHash.slice(0, 10)}...{mockHash.slice(-8)}
            </a>
          </div>
        </div>
      ),
      duration: 8000,
    });
  };

  const simulateApprovalSuccess = () => {
    const celoscanUrl = getCeloscanUrl(mockHash);
    toast({
      title: '⏳ Aprobación enviada',
      description: (
        <div className="space-y-2">
          <p>Esperando confirmación de la aprobación...</p>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Hash:</span>
            <a 
              href={celoscanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-blue-600 hover:text-blue-800 hover:bg-gray-200 transition-colors"
            >
              {mockHash.slice(0, 10)}...{mockHash.slice(-8)}
            </a>
          </div>
        </div>
      ),
      duration: 5000,
    });
  };

  const simulateAdminSuccess = () => {
    const celoscanUrl = getCeloscanUrl(mockHash);
    toast({
      title: "✅ ¡Operación completada exitosamente!",
      description: (
        <div className="space-y-2">
          <p>La operación ha sido procesada correctamente.</p>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Hash:</span>
            <a 
              href={celoscanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-blue-600 hover:text-blue-800 hover:bg-gray-200 transition-colors"
            >
              {mockHash.slice(0, 10)}...{mockHash.slice(-8)}
            </a>
          </div>
        </div>
      ),
      duration: 8000,
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 shadow-lg"
        >
          🧪
        </Button>
      ) : (
        <Card className="w-80 shadow-xl border-2 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>🧪 Test Menu</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={simulateSuccessClaim}
                size="sm"
                className="text-xs bg-green-600 hover:bg-green-700"
              >
                ✅ Éxito Reclamar
              </Button>
              <Button
                onClick={simulatePendingTransaction}
                size="sm"
                className="text-xs bg-yellow-600 hover:bg-yellow-700"
              >
                ⏳ Pendiente
              </Button>
              <Button
                onClick={simulateError}
                size="sm"
                className="text-xs bg-red-600 hover:bg-red-700"
              >
                ❌ Error
              </Button>
              <Button
                onClick={simulateDonationSuccess}
                size="sm"
                className="text-xs bg-purple-600 hover:bg-purple-700"
              >
                💰 Donación
              </Button>
              <Button
                onClick={simulateApprovalSuccess}
                size="sm"
                className="text-xs bg-orange-600 hover:bg-orange-700"
              >
                🔐 Aprobación
              </Button>
              <Button
                onClick={simulateAdminSuccess}
                size="sm"
                className="text-xs bg-indigo-600 hover:bg-indigo-700"
              >
                👑 Admin
              </Button>
            </div>
            <div className="pt-2 text-xs text-gray-500 text-center">
              Menú de testing - Eliminar en producción
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default TestMenu; 