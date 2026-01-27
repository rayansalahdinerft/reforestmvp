import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { CHAIN_INFO, type SupportedChainId } from '@/config/chains';

interface ChainSelectorProps {
  selectedChainId: number;
  onChainChange: (chainId: number) => void;
}

const ChainSelector = ({ selectedChainId, onChainChange }: ChainSelectorProps) => {
  const currentChain = CHAIN_INFO[selectedChainId as SupportedChainId];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors border border-border/50">
          <span className="text-lg">{currentChain?.icon || '🌐'}</span>
          <span className="font-medium text-sm text-foreground">
            {currentChain?.name || 'Select Chain'}
          </span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card border-border" align="start">
        {Object.entries(CHAIN_INFO).map(([chainId, info]) => (
          <DropdownMenuItem
            key={chainId}
            onClick={() => onChainChange(Number(chainId))}
            className={`flex items-center gap-2 cursor-pointer ${
              Number(chainId) === selectedChainId ? 'bg-primary/10' : ''
            }`}
          >
            <span className="text-lg">{info.icon}</span>
            <span>{info.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChainSelector;
