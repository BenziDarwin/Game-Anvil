'use client'

import { useState } from 'react'
import { AppSidebar } from '@/components/Profile/SideBar'
import { SidebarProvider } from '@/components/ui/sidebar'
import NFTForms from '@/components/NFTForms'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getEthPrice } from '@/actions/getEthPrice'

export default function Page() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [collectionData, setCollectionData] = useState({ symbol: '', name: '' })
  const [ethPrice, setEthPrice] = useState<number | null>(null)
  const creationFeeEth = 0.001

  const handleCreateCollection = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const symbol = formData.get('symbol') as string
    const name = formData.get('name') as string

    setCollectionData({ symbol, name })

    // Fetch the current ETH price
    const price = await getEthPrice()
    setEthPrice(price)

    setIsDialogOpen(false)
    setIsConfirmDialogOpen(true)
  }

  const handleConfirmCreation = () => {
    // Here you would typically send this data to your backend or smart contract
    console.log('Creating collection:', collectionData)
    setIsConfirmDialogOpen(false)
    // Additional logic for creating the collection
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto bg-background p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">NFT Dashboard</h1>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Create Collection</Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleCreateCollection}>
                    <DialogHeader>
                      <DialogTitle>Create New Collection</DialogTitle>
                      <DialogDescription>
                        Enter the details for your new NFT collection.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="symbol" className="text-right">
                          Symbol
                        </Label>
                        <Input
                          id="symbol"
                          name="symbol"
                          placeholder="e.g. MYNFT"
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="My Awesome NFT Collection"
                          className="col-span-3"
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Create Collection</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="bg-card p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-6">Create New NFT</h2>
              <NFTForms />
            </div>
          </div>
        </main>
      </div>
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Collection Creation</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to create a new collection with the following details:
              <br />
              Symbol: {collectionData.symbol}
              <br />
              Name: {collectionData.name}
              <br /><br />
              Creating a new collection will cost approximately {creationFeeEth} ETH
              {ethPrice && (
                <span className="block mt-2">
                  (≈ ${(creationFeeEth * ethPrice).toFixed(2)} USD)
                </span>
              )}
              <br />
              Do you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCreation}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  )
}

