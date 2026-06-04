// 'use client';
// import React from 'react';
// import Image from 'next/image';
// import { useSession } from '@/lib/auth-client';
// import {
//   Gear,
//   LayoutHeaderCellsLarge,
//   Briefcase,
//   FolderOpen,
//   ChevronsUpWide,
//   LayoutSideContent,
// } from '@gravity-ui/icons';
// import { Button, Drawer } from '@heroui/react';

// export function DashboardSidebar() {
//   const { data: session, isPending } = useSession();
//   const user = session?.user;

//   const navItems = [
//     { icon: LayoutHeaderCellsLarge, label: 'Dashboard', active: true },
//     { icon: ChevronsUpWide, label: 'My Company' },
//     { icon: Briefcase, label: 'Manage Jobs' },
//     { icon: FolderOpen, label: 'Applications' },
//     { icon: Gear, label: 'Settings' },
//   ];

//   const navContent = (
//     <div className="flex flex-col h-full bg-[#09090b] text-zinc-400 font-sans select-none">
//       {/* Top User Profile Section */}
//       <div className="p-5 flex flex-col gap-3 border-b border-zinc-800/50">
//         <div className="flex items-center gap-3">
//           {user?.image ? (
//             <div className="relative h-11 w-11 shrink-0 rounded-full overflow-hidden border border-zinc-700 bg-zinc-900">
//               <Image
//                 src={user.image}
//                 alt={user?.name || 'User profile picture'}
//                 fill 
//                 sizes="44px"
//                 className="object-cover object-center" 
//                 priority
//               />
//             </div>
//           ) : (
//             <div className="size-11 shrink-0 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 text-white font-medium">
//               {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
//             </div>
//           )}

//           {/* User Name & Role */}
//           <div className="flex flex-col min-w-0">
//             <span className="text-white text-md font-semibold truncate tracking-tight">
//               {isPending ? 'Loading...' : user?.name || 'Alex Sterling'}
//             </span>
//             <span className="text-zinc-500 text-xs font-medium">Recruiter</span>
//           </div>
//         </div>

//         {/* Premium Account Badge */}
//         <div className="bg-[#242427] text-zinc-300 border border-zinc-700/60 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded w-fit">
//           Premium Account
//         </div>
//       </div>

//       {/* Navigation Items Link List */}
//       <nav className="flex flex-col gap-1 p-3 pt-4">
//         {navItems.map((item) => (
//           <button
//             key={item.label}
//             className={`flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium transition-all relative w-full group text-left ${
//               item.active
//                 ? 'text-white bg-[#1c1c1e]'
//                 : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
//             }`}
//             type="button"
//           >
//             {/* Active Indication Vertical Bar on Right Side */}
//             {item.active && (
//               <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-white rounded-l-md" />
//             )}

//             <item.icon
//               className={`size-[18px] transition-colors ${
//                 item.active
//                   ? 'text-white'
//                   : 'text-zinc-500 group-hover:text-zinc-400'
//               }`}
//             />

//             <span>{item.label}</span>
//           </button>
//         ))}
//       </nav>
//     </div>
//   );

//   return (
//     <>
//       {/* Desktop View Sidebar */}
//       <aside className="hidden w-64 shrink-0 border-r border-zinc-800/80 bg-[#09090b] lg:block h-screen sticky top-0">
//         {navContent}
//       </aside>

//       {/* HeroUI Mobile View Drawer */}
//       <Drawer>
//         <Button className="lg:hidden" variant="secondary">
//           <LayoutSideContent />
//           Sidebar
//         </Button>
//         <Drawer.Backdrop>
//           <Drawer.Content
//             placement="left"
//             className="p-0 bg-[#09090b] border-r border-zinc-800"
//           >
//             <Drawer.Dialog>
//               <Drawer.CloseTrigger className="text-zinc-400 hover:text-white" />
//               <Drawer.Header className="border-b border-zinc-800/60">
//                 <Drawer.Heading className="text-white">
//                   Navigation
//                 </Drawer.Heading>
//               </Drawer.Header>
//               <Drawer.Body className="p-0">{navContent}</Drawer.Body>
//             </Drawer.Dialog>
//           </Drawer.Content>
//         </Drawer.Backdrop>
//       </Drawer>
//     </>
//   );
// }






"use client";
import React from 'react';
import Image from 'next/image';
import { useSession } from '@/lib/auth-client';
// আপনার প্রোভাইড করা ভ্যালিড Gravity UI Icons
import { 
  Gear, 
  LayoutHeaderCellsLarge, 
  Briefcase, 
  FolderOpen, 
  ChevronsUpWide, 
  LayoutSideContent 
} from '@gravity-ui/icons';
import { Button, Drawer } from '@heroui/react';

export function DashboardSidebar() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  // মোবাইল ড্রয়ারের ওপেন/ক্লোজ স্টেট ম্যানেজমেন্ট
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { icon: LayoutHeaderCellsLarge, label: 'Dashboard', active: true },
    { icon: ChevronsUpWide, label: 'My Company' },
    { icon: Briefcase, label: 'Manage Jobs' },
    { icon: FolderOpen, label: 'Applications' },
    { icon: Gear, label: 'Settings' },
  ];

  // সাইডবারের মূল ভেতরের কন্টেন্ট (যা ডেক্সটপ ও মোবাইল ড্রয়ার দুই জায়গাতেই রেন্ডার হবে)
  const navContent = (
    <div className="flex flex-col h-full bg-[#0c0c0e] text-zinc-400 font-sans select-none w-full">
      
      {/* 1. Brand Logo Area (image_d952b7.png স্ক্রিনশট অনুযায়ী) */}
      <div className="px-6 pt-7 pb-5">
        <span className="text-white font-bold text-2xl tracking-tight block">
          Hire<span className="text-white">Loop</span>
        </span>
      </div>

      {/* 2. User Profile Info Box */}
      <div className="px-6 py-4 flex flex-col gap-3 border-b border-zinc-900">
        <div className="flex items-center gap-3">
          {/* প্রোফাইল ইমেজ কন্টেইনার (ফিক্সড ও অপ্টিমাইজড) */}
          {user?.image ? (
            <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden border border-zinc-800 bg-zinc-900">
              <Image 
                src={user.image} 
                alt={user?.name || "User profile picture"} 
                fill 
                sizes="40px"
                className="object-cover object-center"
                priority
              />
            </div>
          ) : (
            <div className="size-10 shrink-0 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-800 text-white font-semibold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
          )}
          
          {/* User Name & Designation */}
          <div className="flex flex-col min-w-0">
            <span className="text-white text-sm font-semibold truncate tracking-tight">
              {isPending ? "Loading..." : (user?.name || "Alex Sterling")}
            </span>
            <span className="text-zinc-500 text-xs">
              Recruiter
            </span>
          </div>
        </div>

        {/* Premium Account Label Badge */}
        <div className="bg-[#1c1c1e] text-zinc-400 border border-zinc-800 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded w-fit">
          Premium Account
        </div>
      </div>

      {/* 3. Navigation Links Map List */}
      <nav className="flex flex-col gap-1 p-3 pt-5 flex-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium transition-all relative w-full group text-left ${
              item.active 
                ? 'text-white bg-[#1c1c1e]' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
            }`}
            type="button"
            onClick={() => setIsOpen(false)} // মোবাইল লিংকে ক্লিক করলে ড্রয়ার বন্ধ হবে
          >
            {/* Active Item Vertical Right indicator bar */}
            {item.active && (
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-white rounded-l-md" />
            )}
            
            <item.icon 
              className={`size-[18px] transition-colors ${
                item.active ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400'
              }`} 
            />
            
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* ----------------- [ DESKTOP VIEW SIDEBAR ] ----------------- */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-zinc-900 bg-[#0c0c0e] h-screen sticky top-0 z-30">
        {navContent}
      </aside>


      {/* ----------------- [ MOBILE RESPONSIVE TOP NAVBAR ] ----------------- */}
      {/* বড় স্ক্রিনে এটি ইনভিজিবল থাকবে, মোবাইলে একটি ক্লিন ডার্ক টপ-বার হিসেবে লুপ ব্যাকগ্রাউন্ডে রেডি থাকবে */}
      <div className="lg:hidden w-full flex items-center justify-between p-4 bg-[#0c0c0e] border-b border-zinc-900 sticky top-0 z-40">
        {/* লোগো */}
        <span className="text-white font-bold text-xl tracking-tight">
          HireLoop
        </span>

        {/* হ্যামবার্গার ট্রিগার বাটন (HeroUI Button স্ট্রাকচার অপরিবর্তিত) */}
        <Button 
          className="bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-xl px-3 h-9 min-w-0" 
          variant="flat"
          onPress={() => setIsOpen(true)}
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </div>


      {/* ----------------- [ HEROUI MOBILE DRAWER PANEL ] ----------------- */}
      <Drawer isOpen={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Backdrop className="bg-black/75 backdrop-blur-sm" />
        <Drawer.Content 
          placement="left" 
          className="p-0 bg-[#0c0c0e] max-w-[270px] h-full border-r border-zinc-900 rounded-none shadow-2xl"
        >
          <Drawer.Dialog className="bg-[#0c0c0e] h-full flex flex-col p-0 rounded-none outline-none">
            {/* ড্রয়ার ক্লোজ হেডার এরিয়া */}
            <div className="flex items-center justify-end p-4 border-b border-zinc-900/60 bg-[#0c0c0e]">
              <Drawer.CloseTrigger 
                className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-zinc-900/60" 
                onClick={() => setIsOpen(false)}
              />
            </div>
            
            {/* ড্রয়ার বডি */}
            <Drawer.Body className="p-0 flex-1 bg-[#0c0c0e] overflow-y-auto">
              {navContent}
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer>
    </>
  );
}