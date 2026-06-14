export default function BookingCardSkeleton() {
  return (
    <div
      className="booking-card-skeleton"
      aria-hidden="true"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%) !important;
          background-size: 200% 100% !important;
          animation: shimmer 1.5s infinite linear !important;
        }
        .booking-card-skeleton {
          position: relative;
          background: white;
          border-radius: 12px;
          border: 1px solid #EAECF0;
          padding: 18px 20px;
          margin-bottom: 10px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          display: flex;
          align-items: center;
          box-sizing: border-box;
          border-left: 3px solid #E5E7EB;
        }
        .skeleton-info-col {
          flex: 1;
          padding: 0;
          min-width: 0;
          box-sizing: border-box;
        }
        .skeleton-train-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .skeleton-train-name-wrapper {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .skeleton-train-name {
          width: 160px;
          height: 15px;
          border-radius: 4px;
        }
        .skeleton-pnr {
          width: 50px;
          height: 12px;
          border-radius: 4px;
        }
        .skeleton-route {
          width: 200px;
          height: 13px;
          border-radius: 4px;
          margin: 8px 0;
        }
        .skeleton-meta-line {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }
        .skeleton-meta-item {
          width: 70px;
          height: 12px;
          border-radius: 4px;
        }
        .skeleton-right-zone {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          box-sizing: border-box;
        }
        .skeleton-right-inner {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
          text-align: right;
        }
        .skeleton-class {
          width: 80px;
          height: 12px;
          border-radius: 4px;
        }
        .skeleton-status {
          width: 70px;
          height: 22px;
          border-radius: 999px;
        }
        .skeleton-chevron {
          width: 16px;
          height: 16px;
          border-radius: 50%;
        }

        @media (max-width: 767px) {
          .booking-card-skeleton {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          .skeleton-info-col {
            padding: 0;
          }
          .skeleton-right-zone {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #F3F4F6;
            padding-top: 12px;
            margin-top: 4px;
            width: 100%;
          }
          .skeleton-right-inner {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .booking-card-skeleton {
            padding: 14px 16px;
          }
          .skeleton-train-name {
            width: 120px;
            height: 14px;
          }
          .skeleton-route {
            width: 160px;
            height: 12px;
          }
          .skeleton-meta-item {
            width: 55px;
            height: 11px;
          }
        }
      ` }} />

      {/* Center Info Col */}
      <div className="skeleton-info-col">
        <div className="skeleton-train-header">
          <div className="skeleton-train-name-wrapper">
            <div className="skeleton-train-name skeleton-shimmer" />
            <div className="skeleton-pnr skeleton-shimmer" />
          </div>
        </div>
        <div className="skeleton-route skeleton-shimmer" />
        <div className="skeleton-meta-line">
          <div className="skeleton-meta-item skeleton-shimmer" />
          <div className="skeleton-meta-item skeleton-shimmer" />
          <div className="skeleton-meta-item skeleton-shimmer" />
        </div>
      </div>

      {/* Right Zone */}
      <div className="skeleton-right-zone">
        <div className="skeleton-right-inner">
          <div className="skeleton-class skeleton-shimmer" />
          <div className="skeleton-status skeleton-shimmer" />
        </div>
        <div className="skeleton-chevron skeleton-shimmer" />
      </div>
    </div>
  );
}
