import { Button } from "@mui/material"
import { useState } from "react"
import SeasonDrawer from "./SeasonDrawer"

type UpdateSeasonProps = {
  seasonId: string
}

const UpdateSeason = (props: UpdateSeasonProps) => {
  const { seasonId } = props
  // const intl = useIntl();

  const [open, setOpen] = useState<boolean>(false)

  const showDrawer = () => setOpen(true)

  const hideDrawer = () => setOpen(false)

  //TODO: add translation
  return (
    <div>
      <Button onClick={showDrawer}>View More</Button>

      {!!open && <SeasonDrawer dismiss={hideDrawer} seasonId={seasonId} open />}
    </div>
  )
}

export default UpdateSeason
