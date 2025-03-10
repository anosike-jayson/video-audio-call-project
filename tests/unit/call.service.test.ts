import { startCall } from "../../src/services/call.service";
import CallModel from "../../src/models/call.model";
import User from "../../src/models/user.model";
import { UserDoc } from "../../src/models/user.model"; 
describe("Call Service", () => {
  describe("startCall", () => {
    it("should start a call with the authenticated user’s username", async () => {
      // Arrange
      const user: UserDoc = await User.create({
        username: "testuser",
        email: "test@example.com",
        password: "hashedpassword",
      });
      const userId = user._id.toString();

      const call = await startCall(userId);

      expect(call).toHaveProperty("_id");
      expect(call.participants).toEqual(["testuser"]);
      expect(call.startTime).toBeInstanceOf(Date);
      expect(call.endTime).toBeUndefined();
      expect(call.duration).toBeUndefined();

      const savedCall = await CallModel.findById(call._id);
      expect(savedCall).toBeTruthy();
      expect(savedCall?.participants).toEqual(["testuser"]);
    });

    it("should throw an error if user is not found", async () => {
      await expect(startCall("nonexistentid")).rejects.toThrow("User not found");
    });
  });
});