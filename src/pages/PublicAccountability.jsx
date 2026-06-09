import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function PublicAccountability() {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/public/donate/campaign/${campaignId}`, { replace: true });
  }, [campaignId, navigate]);

  return null;
}
