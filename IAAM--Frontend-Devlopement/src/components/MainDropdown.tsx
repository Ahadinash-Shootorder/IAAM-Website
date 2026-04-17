'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'
import LazyImage from '@/components/common/LazyImage'

const API = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, '') || 'http://admin.iaamonline.org'

export default function MainDropdown({ section }: { section: any }) {
  const [open, setOpen] = useState(false)

  const {
    Title,
    Description,
    ButtonLabel,
    ButtonLink,
    LeftCard,
    Links,
  } = section

  /* ================= LEFT CARD IMAGE ================= */
  const imageUrl =
    LeftCard?.Image?.url
      ? API + LeftCard.Image.url
      : null

  const orderedLinks = [...(Links || [])].sort((a: any, b: any) => {
    const aCount = Array.isArray(a.Sublinks) ? a.Sublinks.length : 0
    const bCount = Array.isArray(b.Sublinks) ? b.Sublinks.length : 0
    return bCount - aCount
  })

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* ================= TRIGGER ================= */}
      <button className="flex items-center gap-1 py-3 px-2 text-sm font-bold text-white hover:bg-white/10">
        {Title}
        <ChevronDown
          className={`h-3 w-3 transition ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="fixed inset-0 top-[156px] z-50 bg-white border-t shadow-lg">
          <div className="flex h-full">

            {/* ================= LEFT CARD ================= */}
            {LeftCard && (
              <div className="hidden lg:block w-1/5 border-r bg-gray-50 p-6">
                {imageUrl && (
                  <LazyImage
                    src={imageUrl}
                    alt={LeftCard.Title}
                    width={300}
                    height={200}
                    className="w-full mb-4 rounded"
                  />
                )}

                {LeftCard.ButtonLabel && (
                  <a
                    href={ButtonLink || '#'}
                    className="block w-full mb-4 text-center bg-[hsl(197,63%,22%)] text-white py-3 rounded font-semibold"
                  >
                    {LeftCard.ButtonLabel}
                  </a>
                )}

                <h3 className="font-bold text-lg mb-2 text-[#156082]">
                  {LeftCard.Title}
                </h3>

                <p className="text-sm text-gray-600">
                  {LeftCard.Description?.[0]?.children?.[0]?.text}
                </p>
              </div>
            )}

            {/* ================= RIGHT PANEL ================= */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-7xl mx-auto px-8 py-8">

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-[#156082]">
                    {Title}
                  </h2>

                  <p className="text-sm text-gray-600 max-w-2xl mb-4">
                    {Description?.[0]?.children?.[0]?.text}
                  </p>

                  {ButtonLabel && (
                    <a
                      href={ButtonLink || '#'}
                      className="inline-flex items-center gap-2 font-semibold text-[hsl(197,63%,22%)]"
                    >
                      <ChevronRight className="w-4 h-4" />
                      {ButtonLabel}
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {orderedLinks.map((link: any) => (
                    <div key={link.id}>
                      <h4 className="font-bold text-sm mb-4 text-[hsl(197,63%,22%)]">
                        {link.LinkTitle}
                      </h4>

                      {Array.isArray(link.Sublinks) &&
                        link.Sublinks.length > 0 && (
                          <div className="space-y-3">
                            {link.Sublinks.map((s: any) => (
                              <a
                                key={s.id}
                                href={s.LinkURL || '#'}
                                className="block text-xs text-gray-600 hover:text-gray-900"
                              >
                                {s.LinkTitle}
                                {s.LinkURL?.startsWith('http') && (
                                  <ExternalLink className="inline w-3 h-3 ml-1" />
                                )}
                              </a>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}































































// 'use client'

// import { useState } from 'react'
// import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'
// import LazyImage from '@/components/common/LazyImage'

// const API =
//   process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, '') ||
//   'http://admin.iaamonline.org'

// export default function MainDropdown({ section }: { section: any }) {
//   const [open, setOpen] = useState(false)

//   const {
//     Title,
//     Description,
//     ButtonLabel,
//     ButtonLink,
//     LeftCard,
//     Links,
//   } = section

//   /* ================= LEFT CARD IMAGE ================= */
//   const imageUrl =
//     LeftCard?.Image?.url
//       ? API + LeftCard.Image.url
//       : null

//   const orderedLinks = [...(Links || [])].sort((a: any, b: any) => {
//     const aCount = Array.isArray(a.Sublinks) ? a.Sublinks.length : 0
//     const bCount = Array.isArray(b.Sublinks) ? b.Sublinks.length : 0
//     return bCount - aCount
//   })

//   return (
//     <div
//       className="relative"
//       onMouseEnter={() => setOpen(true)}
//       onMouseLeave={() => setOpen(false)}
//     >
//       {/* ================= TRIGGER ================= */}
//       <button className="flex items-center gap-1 py-3 px-2 text-sm font-bold text-white hover:bg-white/10">
//         {Title}
//         <ChevronDown
//           className={`h-3 w-3 transition ${
//             open ? 'rotate-180' : ''
//           }`}
//         />
//       </button>

//       {open && (
//         <div className="fixed inset-0 top-[156px] z-50 bg-white border-t shadow-lg">
//           <div className="flex h-full">

//             {/* ================= LEFT CARD ================= */}
//             {LeftCard && (
//               <div className="hidden lg:block w-1/5 border-r bg-gray-50 p-6">
//                 {imageUrl && (
//                   <LazyImage
//                     src={imageUrl}
//                     alt={LeftCard.Title}
//                     width={300}
//                     height={200}
//                     className="w-full mb-4 rounded"
//                   />
//                 )}

//                 {LeftCard.ButtonLabel && (
//                   <a
//                     href={ButtonLink || '#'}
//                     className="block w-full mb-4 text-center bg-[hsl(197,63%,22%)] text-white py-3 rounded font-semibold"
//                   >
//                     {LeftCard.ButtonLabel}
//                   </a>
//                 )}

//                 <h3 className="font-bold text-lg mb-2 text-[#156082]">
//                   {LeftCard.Title}
//                 </h3>

//                 <p className="text-sm text-gray-600">
//                   {LeftCard.Description?.[0]?.children?.[0]?.text}
//                 </p>
//               </div>
//             )}

//             {/* ================= RIGHT PANEL ================= */}
//             <div className="flex-1 overflow-y-auto">
//               <div className="max-w-7xl mx-auto px-8 py-8">

//                 <div className="mb-8">
//                   <h2 className="text-2xl font-bold mb-4 text-[#156082]">
//                     {Title}
//                   </h2>

//                   <p className="text-sm text-gray-600 max-w-2xl mb-4">
//                     {Description?.[0]?.children?.[0]?.text}
//                   </p>

//                   {ButtonLabel && (
//                     <a
//                       href={ButtonLink || '#'}
//                       className="inline-flex items-center gap-2 font-semibold text-[hsl(197,63%,22%)]"
//                     >
//                       <ChevronRight className="w-4 h-4" />
//                       {ButtonLabel}
//                     </a>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                   {orderedLinks.map((link: any) => (
//                     <div key={link.id}>
//                       <h4 className="font-bold text-sm mb-4 text-[hsl(197,63%,22%)]">
//                         {link.LinkTitle}
//                       </h4>

//                       {Array.isArray(link.Sublinks) &&
//                         link.Sublinks.length > 0 && (
//                           <div className="space-y-3">
//                             {link.Sublinks.map((s: any) => (
//                               <a
//                                 key={s.id}
//                                 href={s.LinkURL || '#'}
//                                 className="block text-xs text-gray-600 hover:text-gray-900"
//                               >
//                                 {s.LinkTitle}
//                                 {s.LinkURL?.startsWith('http') && (
//                                   <ExternalLink className="inline w-3 h-3 ml-1" />
//                                 )}
//                               </a>
//                             ))}
//                           </div>
//                         )}
//                     </div>
//                   ))}
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }



































































// 'use client'

// import { useState } from 'react'
// import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'
// import LazyImage from '@/components/common/LazyImage'

// const API =
//   process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, '') ||
//   'http://admin.iaamonline.org'

// export default function MainDropdown({ section }: { section: any }) {
//   const [open, setOpen] = useState(false)

//   const {
//     Title,
//     Description,
//     ButtonLabel,
//     ButtonLink,
//     LeftCard,
//     Links,
//   } = section

//   /* ================= LEFT CARD IMAGE ================= */
//   const imageUrl =
//     LeftCard?.Image?.url
//       ? API + LeftCard.Image.url
//       : null

//   const orderedLinks = [...(Links || [])].sort((a: any, b: any) => {
//     const aCount = Array.isArray(a.Sublinks) ? a.Sublinks.length : 0
//     const bCount = Array.isArray(b.Sublinks) ? b.Sublinks.length : 0

//     // Descending order (more sublinks first)
//     return bCount - aCount
//   })

//   return (
//     <div
//       className="relative"
//       onMouseEnter={() => setOpen(true)}
//       onMouseLeave={() => setOpen(false)}
//     >
//       {/* ================= TRIGGER ================= */}
//       <button className="flex items-center gap-1 py-3 px-2 text-sm font-bold text-white hover:bg-white/10">
//         {Title}
//         <ChevronDown
//           className={`h-3 w-3 transition ${
//             open ? 'rotate-180' : ''
//           }`}
//         />
//       </button>

//       {open && (
//         <div className="fixed inset-0 top-[156px] z-50 bg-white border-t shadow-lg">
//           <div className="flex h-full">

//             {/* ================= LEFT CARD ================= */}
//             {LeftCard && (
//               <div className="hidden lg:block w-1/5 border-r bg-gray-50 p-6">

//                 {/* IMAGE */}
//                 {imageUrl && (
//                   <LazyImage
//                     src={imageUrl}
//                     alt={LeftCard.Title}
//                     width={300}
//                     height={200}
//                     className="w-full mb-4 rounded"
//                   />
//                 )}

//                 {/* BUTTON */}
//                 {LeftCard.ButtonLabel && (
//                   <a
//                     href={ButtonLink || '#'}
//                     className="block w-full mb-4 text-center bg-[hsl(197,63%,22%)] text-white py-3 rounded font-semibold"
//                   >
//                     {LeftCard.ButtonLabel}
//                   </a>
//                 )}

//                 {/* TITLE */}
//                 <h3 className="font-bold text-lg mb-2 text-[#156082]">
//                   {LeftCard.Title}
//                 </h3>

//                 {/* DESCRIPTION */}
//                 <p className="text-sm text-gray-600">
//                   {LeftCard.Description?.[0]?.children?.[0]?.text}
//                 </p>
//               </div>
//             )}

//             {/* ================= RIGHT PANEL ================= */}
//             <div className="flex-1 overflow-y-auto">
//               <div className="max-w-7xl mx-auto px-8 py-8">

//                 {/* HEADER */}
//                 <div className="mb-8">
//                   <h2 className="text-2xl font-bold mb-4 text-[#156082]">
//                     {Title}
//                   </h2>

//                   <p className="text-sm text-gray-600 max-w-2xl mb-4">
//                     {Description?.[0]?.children?.[0]?.text}
//                   </p>

//                   {ButtonLabel && (
//                     <a
//                       href={ButtonLink || '#'}
//                       className="inline-flex items-center gap-2 font-semibold text-[hsl(197,63%,22%)]"
//                     >
//                       <ChevronRight className="w-4 h-4" />
//                       {ButtonLabel}
//                     </a>
//                   )}
//                 </div>

//                 {/* ================= LINKS GRID ================= */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                   {orderedLinks.map((link: any) => (
//                     <div key={link.id}>
//                       <h4 className="font-bold text-sm mb-4 text-[hsl(197,63%,22%)]">
//                         {link.LinkTitle}
//                       </h4>

//                       {/* SUBLINKS (ONLY IF EXISTS) */}
//                       {Array.isArray(link.Sublinks) &&
//                         link.Sublinks.length > 0 && (
//                           <div className="space-y-3">
//                             {link.Sublinks.map((s: any) => (
//                               <a
//                                 key={s.id}
//                                 href={s.LinkURL || '#'}
//                                 className="block text-xs text-gray-600 hover:text-gray-900"
//                               >
//                                 {s.LinkTitle}
//                                 {s.LinkURL?.startsWith('http') && (
//                                   <ExternalLink className="inline w-3 h-3 ml-1" />
//                                 )}
//                               </a>
//                             ))}
//                           </div>
//                         )}
//                     </div>
//                   ))}
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }















































































































































































































// 'use client'

// import { useState } from 'react'
// import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'
// import LazyImage from '@/components/common/LazyImage'

// const API =
//   process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, '') ||
//   'http://admin.iaamonline.org'

// export default function MainDropdown({ section }: { section: any }) {
//   const [open, setOpen] = useState(false)

//   const {
//     Title,
//     Description,
//     ButtonLabel,
//     ButtonLink,
//     LeftCard,
//     Links,
//   } = section

//    const imageUrl =
//     LeftCard?.Image?.url
//       ? API + LeftCard.Image.url
//       : null

//   return (
//     <div
//       className="relative"
//       onMouseEnter={() => setOpen(true)}
//       onMouseLeave={() => setOpen(false)}
//     >
//       {/* Trigger */}
//       <button className="flex items-center gap-1 py-3 px-2 text-sm font-bold text-white hover:bg-white/10">
//         {Title}
//         <ChevronDown className={`h-3 w-3 transition ${open ? 'rotate-180' : ''}`} />
//       </button>

//       {open && (
//         <div className="fixed inset-0 top-[157px] z-50 bg-white border-t shadow-lg">
//           <div className="flex h-full">

//             {/* LEFT CARD */}
//             {LeftCard && (
//               <div className="hidden lg:block w-1/5 border-r bg-gray-50 p-6">
                
//                 {/* IMAGE */}
//                 {imageUrl && (
//                   <LazyImage
//                     src={imageUrl}
//                     alt={LeftCard.Title}
//                     width={300}
//                     height={200}
//                     className="w-full mb-4 rounded"
//                   />
//                 )}

//                 {/* BUTTON */}
//                 {LeftCard.ButtonLabel && (
//                   <a
//                     href={ButtonLink || '#'}
//                     className="block w-full mb-4 text-center bg-[hsl(197,63%,22%)] text-white py-3 rounded font-semibold"
//                   >
//                     {LeftCard.ButtonLabel}
//                   </a>
//                 )}

//                 {/* TITLE */}
//                 <h3 className="font-bold text-lg mb-2 text-[#156082]">
//                   {LeftCard.Title}
//                 </h3>

//                 {/* DESCRIPTION */}
//                 <p className="text-sm text-gray-600">
//                   {LeftCard.Description?.[0]?.children?.[0]?.text}
//                 </p>
//               </div>
//             )}

//             {/* RIGHT PANEL */}
//             <div className="flex-1 overflow-y-auto">
//               <div className="max-w-7xl mx-auto px-8 py-8">

//                 {/* HEADER */}
//                 <div className="mb-8">
//                   <h2 className="text-2xl font-bold mb-4 text-[#156082]">
//                     {Title}
//                   </h2>

//                   <p className="text-sm text-gray-600 max-w-2xl mb-4">
//                     {Description?.[0]?.children?.[0]?.text}
//                   </p>

//                   {ButtonLabel && (
//                     <a
//                       href={ButtonLink || '#'}
//                       className="inline-flex items-center gap-2 font-semibold text-[hsl(197,63%,22%)]"
//                     >
//                       <ChevronRight className="w-4 h-4" />
//                       {ButtonLabel}
//                     </a>
//                   )}
//                 </div>

//                 {/* LINKS GRID */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//                   {Links?.map((link: any) => (
//                     <div key={link.id}>
//                       <h4 className="font-bold text-sm mb-4 text-[hsl(197,63%,22%)]">
//                         {link.LinkTitle}
//                       </h4>

//                       <div className="space-y-3">
//                         {link.Sublinks?.map((s: any) => (
//                           <a
//                             key={s.id}
//                             href={s.LinkURL || '#'}
//                             className="block text-xs text-gray-600 hover:text-gray-900"
//                           >
//                             {s.LinkTitle}
//                             {s.LinkURL?.startsWith('http') && (
//                               <ExternalLink className="inline w-3 h-3 ml-1" />
//                             )}
//                           </a>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
