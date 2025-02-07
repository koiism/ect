'use client'

import { Product } from '@/payload-types'
import { CiClock1, CiMoneyBill, CiMedicalCase, CiShoppingTag } from 'react-icons/ci'

interface AboutThisTourProps {
  product: Product
}

interface InfoItemProps {
  icon: React.ReactNode
  title: string
  description: string
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, title, description }) => {
  return (
    <div className="flex items-start gap-4 py-2 px-4">
      <div className="text-2xl">{icon}</div>
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

const AboutThisTour: React.FC<AboutThisTourProps> = ({ product }) => {
  const { aboutThisTour } = product

  const formatDuration = (duration: number) => {
    if (duration < 24) {
      return `${duration} hours`
    }
    const days = Math.floor(duration / 24)
    const hours = duration % 24
    return hours > 0 ? `${days} days ${hours} hours` : `${days} days`
  }

  const formatCancellation = (days: number) => {
    if (days === 0) {
      return 'Non-refundable'
    }
    if (days === 1) {
      return 'Free cancellation up to 24 hours in advance'
    }
    return `Free cancellation up to ${days} days in advance`
  }

  return (
    <div className="flex flex-col gap-2">
      <InfoItem
        icon={<CiClock1 />}
        title="Duration"
        description={formatDuration(aboutThisTour.duration)}
      />
      <InfoItem
        icon={<CiMoneyBill />}
        title="Cancellation Policy"
        description={formatCancellation(aboutThisTour.cancellation)}
      />
      {aboutThisTour.disabledFriendly && (
        <InfoItem
          icon={<CiMedicalCase />}
          title="Accessibility"
          description="This tour is wheelchair accessible"
        />
      )}
      {aboutThisTour.skipTicketLine && (
        <InfoItem
          icon={<CiShoppingTag />}
          title="Skip The Line"
          description="Skip the line access at attractions"
        />
      )}
    </div>
  )
}

export default AboutThisTour
