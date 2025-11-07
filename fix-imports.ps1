# Script para corregir todas las importaciones rotas en ByteCallers
Write-Host "Iniciando correccion de importaciones..." -ForegroundColor Green

$projectRoot = "c:\Users\edwar\Desktop\Byte-callers"

# Funcion para reemplazar contenido en archivo
function Replace-InFile {
    param(
        [string]$FilePath,
        [string]$OldText,
        [string]$NewText
    )
    
    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath -Raw -Encoding UTF8
        if ($content -match [regex]::Escape($OldText)) {
            $content = $content -replace [regex]::Escape($OldText), $NewText
            Set-Content $FilePath -Value $content -Encoding UTF8 -NoNewline
            Write-Host "Actualizado: $FilePath" -ForegroundColor Cyan
            return $true
        }
    }
    return $false
}

# Home.tsx
Write-Host "[1/10] Corrigiendo Home.tsx..." -ForegroundColor Yellow
Replace-InFile -FilePath "$projectRoot\src\infrastructure\ui\components\landing\Home.tsx" -OldText "import { Card } from '../../shared/ui';" -NewText "import { Card } from '../shared/Card';"

# Solutions.tsx
Write-Host "[2/10] Corrigiendo Solutions.tsx..." -ForegroundColor Yellow
Replace-InFile -FilePath "$projectRoot\src\infrastructure\ui\components\landing\Solutions.tsx" -OldText "import { Card } from '../../shared/ui';" -NewText "import { Card } from '../shared/Card';"

# Enterprise.tsx
Write-Host "[3/10] Corrigiendo Enterprise.tsx..." -ForegroundColor Yellow
Replace-InFile -FilePath "$projectRoot\src\infrastructure\ui\components\landing\Enterprise.tsx" -OldText "import { Card } from '../../shared/ui';" -NewText "import { Card } from '../shared/Card';"
Replace-InFile -FilePath "$projectRoot\src\infrastructure\ui\components\landing\Enterprise.tsx" -OldText "import enterpriseData from '../data/infoPageJson/enterprise.json';" -NewText "import enterpriseData from '../../../../shared/data/infoPageJson/enterprise.json';"

# Testimonials.tsx
Write-Host "[4/10] Corrigiendo Testimonials.tsx..." -ForegroundColor Yellow
Replace-InFile -FilePath "$projectRoot\src\infrastructure\ui\components\landing\Testimonials.tsx" -OldText "import { Card } from '../../shared/ui';" -NewText "import { Card } from '../shared/Card';"
Replace-InFile -FilePath "$projectRoot\src\infrastructure\ui\components\landing\Testimonials.tsx" -OldText "import testimonialsData from '../data/infoPageJson/testimonials.json';" -NewText "import testimonialsData from '../../../../shared/data/infoPageJson/testimonials.json';"

# ContactForm.tsx
Write-Host "[5/10] Corrigiendo ContactForm.tsx..." -ForegroundColor Yellow
$oldImport = "import { Input, Button } from '../../shared/ui';"
$newImport = @"
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
"@
Replace-InFile -FilePath "$projectRoot\src\infrastructure\ui\components\landing\ContactForm.tsx" -OldText $oldImport -NewText $newImport

# AIShowcase.tsx
Write-Host "[6/10] Corrigiendo AIShowcase.tsx..." -ForegroundColor Yellow
Replace-InFile -FilePath "$projectRoot\src\infrastructure\ui\components\landing\AIShowcase.tsx" -OldText "import demos from '../data/infoPageJson/aiShowcase.json';" -NewText "import demos from '../../../../shared/data/infoPageJson/aiShowcase.json';"

# AIAssistant.tsx
Write-Host "[7/10] Corrigiendo AIAssistant.tsx..." -ForegroundColor Yellow
Replace-InFile -FilePath "$projectRoot\src\infrastructure\ui\components\features\AIAssistant.tsx" -OldText "import { useChatbot, CallType } from './Utils/useChatbot';" -NewText "import { useChatbot, CallType } from '../../hooks/useChatbot';"
Replace-InFile -FilePath "$projectRoot\src\infrastructure\ui\components\features\AIAssistant.tsx" -OldText "import { registerChatbotCallback, CallInfo } from './APIButtonController';" -NewText "import { registerChatbotCallback, CallInfo } from '../../../adapters/services/APIButtonController';"

# TicketsPage.tsx
Write-Host "[8/10] Corrigiendo TicketsPage.tsx..." -ForegroundColor Yellow
Replace-InFile -FilePath "$projectRoot\src\infrastructure\ui\pages\app\TicketsPage.tsx" -OldText "import { User } from '../../../core/domain/entities/User';" -NewText "import { User } from '../../../../core/domain/entities/User';"
Replace-InFile -FilePath "$projectRoot\src\infrastructure\ui\pages\app\TicketsPage.tsx" -OldText "import { AIAssistant } from './call/AI/AIAssistant';" -NewText "import { AIAssistant } from '../../components/features/AIAssistant';"
Replace-InFile -FilePath "$projectRoot\src\infrastructure\ui\pages\app\TicketsPage.tsx" -OldText "import { APIButtonController } from './call/AI/APIButtonController';" -NewText "import { APIButtonController } from '../../../adapters/services/APIButtonController';"
Replace-InFile -FilePath "$projectRoot\src\infrastructure\ui\pages\app\TicketsPage.tsx" -OldText "import { SessionWarningModal } from '../shared/ui/SessionWarningModal';" -NewText "import { SessionWarningModal } from '../../components/shared/SessionWarningModal';"

Write-Host "Correccion completada!" -ForegroundColor Green
