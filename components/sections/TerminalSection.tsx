import React from 'react';

const TerminalSection: React.FC = () => {
  return (
    <div className="w-full h-full p-4 md:p-6 lg:p-8 font-mono text-xs md:text-sm text-slate-300 overflow-y-auto">
      {/* Command Prompt */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-red-400 font-bold">[fare@fuckwin <span className="text-slate-300">~</span>]$</span>
        <span className="text-slate-200">fastfetch</span>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 pl-2">
        {/* Arch Linux ASCII Art */}
        <pre className="text-accent1 leading-[1.2] tracking-tight shrink-0 font-mono select-all">
          {`                   -\`
                  .o+\`
                 \`ooo/
                \`+oooo:
               \`+oooooo:
               -+oooooo+:
             \`/:-:++oooo+:
            \`/++++/+++++++:
           \`/++++++++++++++:
          \`/+++ooooooooooooo/\`
         ./ooosssso++osssssso+\`
        .oossssso-\`\`\`\`/ossssss+\`
       -osssssso.      :ssssssso.
      :osssssss/        osssso+++.
     /ossssssss/        +ssssooo/-
    \`/ossssso+/-        -:/+osssso+-
   \`+sso+:-\`                 \`.-/+oso:
  \`++:.                           \`-/+/
 .\`                                 \`/`}
        </pre>

        {/* System Info */}
        <div className="flex flex-col space-y-1">
          <div className="text-red-400 font-bold mb-1">fare@fuckwin</div>
          <div className="text-slate-500 mb-2">------------</div>
          <div><span className="text-accent1 font-bold">OS:</span> Arch Linux x86_64</div>
          <div><span className="text-accent1 font-bold">Host:</span> MS-7D76</div>
          <div><span className="text-accent1 font-bold">Kernel:</span> Linux-lts 6.12.73-1</div>
          <div><span className="text-accent1 font-bold">Uptime:</span> 13 hours, 45 mins</div>
          <div><span className="text-accent1 font-bold">Packages:</span> 172 (pacman)</div>
          <div><span className="text-accent1 font-bold">Shell:</span> bash 5.2.37</div>
          <div><span className="text-accent1 font-bold">WM:</span> Hyprland (Wayland)</div>
          <div><span className="text-accent1 font-bold">Terminal:</span> konsole 25.12.2-1</div>
          <div><span className="text-accent1 font-bold">CPU:</span> AMD Ryzen 5 7600X (12) @ 4.70 GHz</div>
          <div><span className="text-accent1 font-bold">GPU:</span> NVIDIA GeForce RTX 4070 Ti SUPER (15.68 GiB) [Discrete]</div>
          <div><span className="text-accent1 font-bold">Memory:</span> 15.86 GiB / 63.60 GiB (25%)</div>
          <div><span className="text-accent1 font-bold">Swap:</span> 105.20 MiB / 4.00 GiB (3%)</div>
          <div><span className="text-accent1 font-bold">Disk (/):</span> 1.49 GiB / 1006.85 GiB (0%) - ext4</div>
          <div><span className="text-accent1 font-bold">Disk (/dev/sda1):</span> 597.78 GiB / 1.82 TiB (32%) - ext4</div>
          <div><span className="text-accent1 font-bold">Disk (/dev/nvme1n1):</span> 30.24 GiB / 953.81 GiB (3%) ext4</div>
          <div><span className="text-accent1 font-bold">Local IP (Ethernet):</span> 192.168.1.2/24</div>
          <div><span className="text-accent1 font-bold">Locale:</span> en_US.UTF-8</div>
        </div>
      </div>

      {/* Blinking Cursor prompt at the end */}
      <div className="mt-6 flex flex-wrap gap-2 items-center">
        <span className="text-red-400 font-bold">[fare@fuckwin <span className="text-slate-300">~</span>]$</span>
        <span className="w-2.5 h-4 bg-slate-300 animate-pulse"></span>
      </div>
    </div>
  );
};

export default TerminalSection;